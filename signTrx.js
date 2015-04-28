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
	this.depositAddr = '';
    }

    TransactionSigner.prototype.signTrx=function() {
        this.signature = '';
        var self = this;
        setTimeout(function(){

            var owner = bts.hash.ripemd160(new bts.Buffer.Buffer(bts.bs58.decode('1ECWivMucRHnFuRzSsSDWUWwnUQvxX9t2T')));
            var addr = new bts.ecc.Address(owner);
        var wc = new bts.blockchain.WithdrawCondition(0,0,1,new bts.blockchain.WithdrawSignatureType(addr.addy));
        ByteBuffer = wc.toByteBuffer().constructor;
        Long = ByteBuffer.Long;
	Buffer = bts.Buffer.Buffer;
	bs58 = bts.bs58;

var tx = bts.blockchain.Transaction.fromByteBuffer(ByteBuffer.fromHex(self.txHex));
console.log(tx);

tx.operations.forEach(function(op){
	if (op.type_id==2) {
        var addr;
        try {
            var owner = bts.hash.ripemd160(new Buffer(bs58.decode(self.depositAddr)))
            addr = new bts.ecc.Address(owner);
        } catch(e) {
            addr = bts.ecc.Address.fromString(self.depositAddr);
        }
	var addr1 = new bts.ecc.Address(op.withdraw_condition.condition.owner);
	console.log(addr.toString());
	console.log(addr1.toString());
	if (addr.toString()!=addr1.toString()) {
		console.error('addr not matched');
	}
	}
});
            var sign = bts.ecc.Signature.signHex(self.txHex, bts.ecc.PrivateKey.fromWif(self.privateKey));
            self.signature = sign.toHex();
        })
    };
// })
