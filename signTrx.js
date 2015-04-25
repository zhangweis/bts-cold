// $(document).ready(function(){
    var signTrx = new Vue({
        el: '#form',
        data: {
            signer: new TransactionSigner(),
            trx: ''
        },
        methods: {
            signTrx:function() {
                signTrx.$data.signer.signTrx();
            }
        }
    });
    function TransactionSigner() {
        this.txHex = '';
        this.privateKey = '';
        this.signature = '';
    }

    TransactionSigner.prototype.signTrx=function() {
        this.signature = '';
        var self = this;
        setTimeout(function(){
            var sign = bts.ecc.Signature.signHex(self.txHex, bts.ecc.PrivateKey.fromWif(self.privateKey));
            self.signature = sign.toHex();
        })
    };
// })
