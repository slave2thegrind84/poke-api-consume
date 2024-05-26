import {  getSpecies, applyTranslation, } from '../src/pokemon';
import {  PokemonSpecies} from "../src/resource";


describe('check translation when legendary', () => {
    test('gets regigigas and checks for legendary and translates description to yoda. Apply language in parameter', () => {
      return getSpecies("regigigas").then(async data => {
          expect(data.name).toMatch("regigigas")  
            var originalDesc:string = data.flavor_text_entries.find((l) => l.language.name === 'en').flavor_text
            var s:PokemonSpecies = await applyTranslation(data) 
            expect(data.applied_language).toMatch("yoda")
            expect(data.flavor_text_entries.find((l) => l.language.name === 'en').flavor_text).not.toMatch(originalDesc)
      });
    });
  });

describe('checks habitat for zubat', () => {
test('gets zubat and checks for cave habitat. Apply translation to shakespeare and apply language in parameter', () => {
    return getSpecies("zubat").then(async data => {
        expect(data.name).toMatch("zubat") 
        expect(data.habitat.name).toMatch("cave")
        var originalDesc:string = data.flavor_text_entries.find((l) => l.language.name === 'en').flavor_text
        var s:PokemonSpecies = await applyTranslation(data) 
        expect(data.applied_language).toMatch("shakespeare")
        expect(data.flavor_text_entries.find((l) => l.language.name === 'en').flavor_text).not.toMatch(originalDesc)
    });
});
    

describe('checks habitat for sentret', () => {
test('gets sentret and checks for cave habitat (which it shouldnt). Should not apply translation', () => {
    return getSpecies("sentret").then(async data => {
        expect(data.name).toMatch("sentret") 
        var originalDesc:string = data.flavor_text_entries.find((l) => l.language.name === 'en').flavor_text
        var s:PokemonSpecies = await applyTranslation(data) 
        expect(data.applied_language).toBeFalsy
        expect(data.flavor_text_entries.find((l) => l.language.name === 'en').flavor_text).toMatch(originalDesc)
    });
});
});
  
});