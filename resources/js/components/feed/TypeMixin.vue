<script>
    import {mapGetters} from "vuex";

    export default {
        computed: {
            ...mapGetters([
                'wallets',
                'incomes',
                'expenses',
                'tags',
                'getTransactions'
            ]),
        },
        methods: {
            getTotalOfExpense(expense_id) {
                let total = 0;
                for (let groupKey in this.getTransactions) {
                    let group = this.getTransactions[groupKey]
                    for (let tranKey in group) {
                        let transaction = group[tranKey]
                        if (transaction.type == 3 && transaction.expense_id == expense_id) {
                            total += Number(transaction.amount);
                        }
                    }
                }
                return total;
            },
            getTypeData(transaction) {
                let data = {}
                switch (transaction.type) {
                    case 1: {
                        data.type = 1
                        data.typeName = 'Доход'
                        data.fromId = transaction.income_id
                        data.fromName = this.incomes[data.fromId].name
                        data.toId = transaction.wallet_id_to
                        data.toName = this.wallets[data.toId].name
                        data.color = 'cstm-green'
                        data.symbol = '+'
                    }
                        break;

                    case 2: {
                        data.type = 2
                        data.typeName = 'Перевод'
                        data.fromId = transaction.wallet_id_from
                        data.fromName = this.wallets[data.fromId].name
                        data.toId = transaction.wallet_id_to
                        data.toName = this.wallets[data.toId].name
                        data.color = 'cstm-yellow'
                        data.symbol = ''
                    }
                        break;

                    case 3: {
                        data.type = 3
                        data.typeName = 'Расход'
                        data.fromId = transaction.wallet_id_from
                        data.fromName = this.wallets[data.fromId].name
                        data.toId = transaction.expense_id
                        data.toName = this.expenses[data.toId].name
                        data.tagId = transaction.tag_id
                        data.tagName = data.tagId !== null ? this.tags[data.tagId].name : ''
                        data.color = 'cstm-red'
                        data.symbol = '-'
                    }
                        break;
                }
                return data;
            }
        }
    }
</script>
