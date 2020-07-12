// const rules: {
//     amount: [
//         {required: true, message: 'Ну, хоть немношко!', trigger: 'blur'},
//         {type: 'number', message: 'Только цыфры!', trigger: 'blur'},
//     ],
//     comment: [
//         {max: 100, message: 'Хватит!', trigger: 'change'}
//     ]
// }

export default {
    rules: {
               amount: [
                   {required: true, message: 'Ну, хоть немношко!', trigger: 'blur'},
                   {type: 'number', message: 'Только цыфры!', trigger: 'blur'},
               ],
               comment: [
                   {max: 100, message: 'Хватит!', trigger: 'change'}
               ]
           }
}
