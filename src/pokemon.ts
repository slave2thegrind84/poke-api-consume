import { NamedAPIResource, PokemonSpecies} from "./resource";

export type ObjectValue<T> = T[keyof T];

export const base_url: string = "https://pokeapi.co/api/v2/"
export const translate_url: string = "https://api.funtranslations.com/translate/"


export async function getResource<T>(resourceURI:string): Promise<T> {
  /** 
   * gets a resource using its URI from pokemon API
   * 
   * @param resourceURI - The full URI of the resource requested as a string
   * @returns the resource as <T>
  */

  var res: object[] = []
  try {
    await fetch(resourceURI)
    .then(function(response) {
      // headers
      if (response.status!=200) throw `fetch ${response.url} failed() ${response.status}:${response.statusText}`;
      return response.json();
    }).then(async function(data) {
      // data    
      res = data 
    });
    return <T>res
  } catch (error) {
    throw error
  }
}


async function getResourceList(base_url:string, resource:string): Promise<Array<NamedAPIResource>> {
  /** 
   * gets a full resource list (including all pages) from the PokeAPI
   * @remarks This will go through all pages until no more are found.
   * 
   * @param base_url - The base url of the API including all paths, minus resource
   * @resource resource
   * @returns an array of NamedAPIResource's 
  */

  var nextPage = `${base_url}/${resource}`
  let resource_set: Array<NamedAPIResource> = []

  try {
    await fetch(nextPage)
    .then(function(response) {
      // headers
      if (response.status!=200) throw `fetch ${response.url} failed() ${response.status}:${response.statusText}`;
      return response.json();
    }).then(async function(data) {
      let res: Array<NamedAPIResource> = data.results 
            
      res.forEach(function(p) {resource_set.push(p)})
      
      //more pages?
      nextPage = data.next
      if(nextPage != null) {
        // recursion on this function until there are no more pages
        var r = await getResourceList(nextPage, resource);  
        r.forEach(function(p) {resource_set.push(p)})
        return r
      }
    });
  } catch (error) {
    console.log(error)
  }
  
  return resource_set
}

export async function funTranslate(text:string, language:string): Promise<string>
{
  /** 
   * Returns a translated string from the FunTranslate
   * 
   * @param text - Text to translate as string
   * @param language - the language to use for translation as string
   * @returns translated text
  */
  
  var res: string = ""
  await fetch(`${translate_url}${language}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text} )
  }).then(function(response) {
      // get headers
      if (response.status!=200) throw `fetch ${response.url} failed() ${response.status}:${response.statusText}`;
      return response.json();
    }).then(async function(data) {
      // get data    
      res = data.contents.translated
    }).catch(Error => {throw Error})
    
    return res
}


async function printSpecies(s:PokemonSpecies) {
  /** 
   * print to the console species information in a formatted and english flavourtext
   * 
   * @param s - the species to print
  */
  console.log(`
  Name: ${s.name}
  Applied Language: ${s.applied_language}
  Species: ${s.name}
  habitat: ${s.habitat?.name}
  Legendary Status : ${s.is_legendary}
  Description: ${s.flavor_text_entries.find((l) => l.language.name === 'en').flavor_text}
 `)
}


function ensure<T>(argument: T | undefined | null, message: string = 'This value was promised to be there.'): T {
  /** 
   * Generic function to check for existence of a parameter
  */
  if (argument === undefined || argument === null) {
    throw new TypeError(message);
  }
  return argument;
}



export async function getSpecies<T>(name:string): Promise<PokemonSpecies>{
  var s:PokemonSpecies
  name = name.toLocaleLowerCase()
  try {
    var species:PokemonSpecies = await getResource<PokemonSpecies>(`${base_url}/pokemon-species/${name}`)
    return species
  } catch (error) {
    throw(error)
  }
  throw new TypeError("undefined");
}


export async function applyTranslation(species:PokemonSpecies): Promise<PokemonSpecies> {
  /** 
   * applies translation if conditions are met. Currently hardcoded.
   * 
   * @param species - The species to apply the translation to
   * @returns if conditions are met, a species with the translation applied and the applied 
   * language parameter set to the language applied
   * 
   * @remarks 
   * regigigas=legend
   * zubat = cave
  */
  var language:string = ""
  if(species.is_legendary === true) { language = "yoda"}
  if(species.habitat?.name === "cave") { language = "shakespeare"}

  
  if(language.length==0) { 
    // no need to translate
    return species 
  }

  var idx = species.flavor_text_entries.findIndex((l) => l.language.name === 'en')
  var description_text: string = species.flavor_text_entries[idx].flavor_text

  try {
    species.flavor_text_entries[idx].flavor_text = await funTranslate(description_text, language)
    species.applied_language = language
    return species
  } catch (error) { 
    throw error 
  }
  
  throw new Error
}



async function run() {
  // get a list of all species
  //var allSpecies:Array<NamedAPIResource> = []
  //allSpecies = await getResourceList(base_url, "pokemon-species")
  
  // Call 1
  getSpecies("zubat").then(function(s) {
    console.log("Endpoint 1")
    printSpecies(s)
  }).catch(error => console.log(error))


  // call 2
  getSpecies("zubat").then(function(s) {
    console.log("Endpoint 2")
    applyTranslation(s).then(function(s) {
      printSpecies(s)
    })
  }).catch(error => console.log(error))

}

run()




