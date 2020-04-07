// const token = require('@vitalets/google-translate-token');
// require('isomorphic-fetch');
// var querystring = require('querystring');
//
// let text = `
//         Valentyn Bilyi, вік: 20
//
//         клуб: MoKiLo, країна: Ukraina
//         вартість: 456 000 грн.
//         зарплата: 6 880 грн.
//         дуже добра [9] форма
//         трагічна [12] тактична дисципліна
//         Зріст: 187 cm, вага: 82.2 kg, ПМТ: 23.51
//
//         добра  витривалість безнадійно [1] воротар
//         безнадійна [1] швидкість адекватно [6] захист
//         слабка [4] техніка слабко [4] півзахист
//         незадовільно [2] пас відмінно [10] напад
//     `;
//
//
// function getSkill(text= '', skillName= '') {
//     const regExp = new RegExp(`[0-9]+[ ]+?${skillName}`);
//     let skill = text.match(regExp);
//
//     if(!skill) {
//         console.log('no skill', skillName);
//         return 0;
//     }
//     return +skill[0].replace(skillName, '');
// }
//
//
// module.exports = new Promise((resolve, reject)=> {
//
//     console.log(1);
//     //token.get(text, { tld: "com" }).then(function (token) {
//         console.log(2);
//         const url = 'https://translate.google.' + "com" + '/translate_a/single';
//         const data = {
//             client: 't',
//             sl: 'auto',
//             tl: 'en',
//             hl: 'en',
//             dt: ['at', 'bd', 'ex', 'ld', 'md', 'qca', 'rw', 'rm', 'ss', 't'],
//             ie: 'UTF-8',
//             oe: 'UTF-8',
//             otf: 1,
//             ssel: 0,
//             tsel: 0,
//             kc: 7,
//             q: text,
//             tk: 898368.728968
//
//         };
//         //data[token.name] = token.value;
//
//         //console.log(token.name, token.value);
//
//         fetch(url + '?' + querystring.stringify(data))
//             .then(res => res.json())
//             .then(res => {
//                 console.log(3);
//                 const result = {
//                     text: ''
//                 };
//
//                 res[0].forEach(function (obj) {
//                     if (obj[0]) result.text += obj[0];
//                 });
//
//
//                 let text = result.text;
//                 text = text.replace(/\[/g, '');
//                 text = text.replace(/]/g, '');
//
//                 const lines = text.split('\n');
//
//                 const titleLine = lines.find(line => line.includes('age'));
//
//                 let playerName = titleLine ?
//                     titleLine.match(/[A-Z][a-z]*(\s[A-Z][a-z]*)*/) ?
//                         titleLine.match(/[A-Z][a-z]*(\s[A-Z][a-z]*)*/)[0]
//                         :
//                         ''
//                     :
//                     "";
//
//                 let age = titleLine ?
//                     titleLine.match(/age[ ]?[0-9]+/) ?
//                         +titleLine.match(/age[ ]?[0-9]+/)[0].slice(titleLine.match(/age[ ]?[0-9]+/)[0].length-2)
//                         :
//                         ""
//                     :
//                     "";
//
//                 console.log('playerName:', playerName);
//                 console.log('age:', age);
//                 console.log('form:', getSkill(text, 'form'));
//                 console.log('tactical discipline:', getSkill(text, 'tactical discipline'));
//                 console.log('stamina:', getSkill(text, 'stamina'));
//                 console.log('goalkeeper:', getSkill(text, 'goalkeeper'));
//
//
//                 resolve({
//                     playerName,
//                     age,
//                     form: getSkill(text, 'form'),
//                 });
//
//             })
//             .catch(e => reject(e));
//    // }).catch(e => reject(e));
// });