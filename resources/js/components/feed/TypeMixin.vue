<script>
export default {
    methods: {
        typeData(type) {
            let data = {}
            switch (type) {
                case 1: {
                    data.type = 1
                    data.typeDescription = 'Доход'
                    data.fromId = this.editorData.edata.income_id
                    data.fromDescription = this.wallets[data.fromId].name
                    data.toId = this.editorData.edata.wallet_id_to
                    data.toDescription = this.wallets[data.toId].name
                }
                    break;

                case 2: {
                    data.type = 2
                    data.typeDescription = 'Перевод'
                    data.fromId = this.editorData.edata.wallet_id_from
                    data.fromDescription = this.wallets[data.fromId].name
                    data.toId = this.editorData.edata.wallet_id_to
                    data.toDescription = this.wallets[data.toId].name
                }
                    break;

                case 3: {
                    data.type = 3
                    data.typeDescription = 'Расход'
                    data.fromId = this.editorData.edata.wallet_id_from
                    data.fromDescription = this.wallets[data.fromId].name
                    data.toId = this.editorData.edata.expense_id
                    data.toDescription = this.expenses[data.toId].name
                    // data.tagId = this.editorData.edata.tag_id
                    // data.tagDescription = this.tags[data.tagId].name
                    // data.expenseIdOfTag = this.tags[data.tagId].expense_id
                    // data.expenseNameOfTag = this.tags[data.tagId].name
                }
                    break;
            }
            return data;
        }
    }
}
</script>

