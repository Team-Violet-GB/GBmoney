<script>
    import {mapGetters} from "vuex";

    export default {
        computed: {
            ...mapGetters([
                'wallets',
                'incomes',
                'expenses',
                'tags'
            ]),
        },
        methods: {
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
                    }
                        break;

                    case 2: {
                        data.type = 2
                        data.typeName = 'Перевод'
                        data.fromId = transaction.wallet_id_from
                        data.fromName = this.wallets[data.fromId].name
                        data.toId = transaction.wallet_id_to
                        data.toName = this.wallets[data.toId].name
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
                        data.expenseIdOfTag = data.tagId !== null ? this.tags[data.tagId].expense_id : null
                        data.expenseNameOfTag = data.tagId !== null ? this.tags[data.tagId].name : ''
                    }
                        break;
                }
                return data;
            }
        }
    }
</script>
