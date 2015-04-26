// $(document).ready(function(){
    var createTrx = new Vue({
        el: '#form',
        data: {
            builder: new TransactionBuilder('1ECWivMucRHnFuRzSsSDWUWwnUQvxX9t2T','1ANGELwQwWxMmbdaSWhWLqBEtPTkWb8uDc'),
            trx: ''
        },
        methods: {
            createTrxFrom:function() {
                createTrx.$data.builder.createTrx();
            },
            signTrx:function() {
                createTrx.$data.builder.signTrx();
            }
        }
    });
    function TransactionBuilder(from, to) {
        this.from = from;
        this.to = to;
        this.trx = '';
        this.assetId = 0;
        this.amount = 1;
        this.signature = '';
        this.signedTrx = {};
    }

    TransactionBuilder.prototype.signTrx=function() {
        var trx = this.trx.obj;
        //var sign = bts.ecc.Signature.signHex(this.trx.hex, bts.ecc.PrivateKey.fromWif('5JWz65pRvLh7kTJLrfRsic2hpHFj7Qypss9YKEgZTcsgGg9tUTb'));
        var sign = bts.ecc.Signature.fromHex(this.signature);
        var signedTrx = new bts.blockchain.SignedTransaction(trx, [sign])
        signedTrx.toJson(o={});
        this.signedTrx = {json:JSON.stringify(o), obj:signedTrx};
    };
    TransactionBuilder.prototype.getBalanceId=function(assetId) {
        var owner = bts.hash.ripemd160(new Buffer(bs58.decode(this.from)));
        var addr = new bts.ecc.Address(owner);
        var wc = new bts.blockchain.WithdrawCondition(assetId,0,1,new bts.blockchain.WithdrawSignatureType(addr.addy));
        return wc.getBalanceId();
    };
    TransactionBuilder.prototype.createTrx=function() {
        var precision = {
            0: 100000,
            22: 10000
        }[this.assetId];
        ByteBuffer = bts.ByteBuffer;
        bs58 = bts.bs58;
        Buffer = bts.Buffer.Buffer;
        var addr;
        try {
            var owner = bts.hash.ripemd160(new Buffer(bs58.decode(this.to)))
            addr = new bts.ecc.Address(owner);
        } catch(e) {
            addr = bts.ecc.Address.fromString(this.to);
        }
        var wc = new bts.blockchain.WithdrawCondition(this.assetId,0,1,new bts.blockchain.WithdrawSignatureType(addr.addy));
        ByteBuffer = wc.toByteBuffer().constructor;
        Long = ByteBuffer.Long;
        
        var deposit = new bts.blockchain.Deposit(Long.fromNumber(precision*this.amount), wc)
        var op = new bts.blockchain.Operation(2, deposit);
        var withdraw = new bts.blockchain.Withdraw(bts.ecc.Address.fromString(this.getBalanceId(this.assetId)).addy, Long.fromNumber(precision*(this.amount)));
        var op1 = new bts.blockchain.Operation(1, withdraw)
        var withdrawTxFee = new bts.blockchain.Withdraw(bts.ecc.Address.fromString(this.getBalanceId(0)).addy, Long.fromNumber(100000*(0.1)));
        var opTxFee = new bts.blockchain.Operation(1, withdrawTxFee)
        
        var date = (Math.floor(new Date().getTime()/1000)+10*60)*1000;
        // var date = new Date("2015-04-26T20:11:09").getTime();
        var trx = new bts.blockchain.Transaction(date,null, [op1,opTxFee, op])
        var buff1 = ByteBuffer.concat([trx.toByteBuffer(), ByteBuffer.fromHex('75c11a81b7670bbaa721cc603eadb2313756f94a3bcbb9928e9101432701ac5f')]);
        trx.toJson(o={})
        this.trx = {
            obj: trx,
            json:(JSON.stringify(o)),
            hex:buff1.toHex()
        };
//        var sign = bts.ecc.Signature.signHex(this.trx.hex, bts.ecc.PrivateKey.fromWif('5KgKbZCRc8VvwHcx76hvUdo1oDjh6pYMgbDgkvgeNi2r4gYy4HA'));
        // this.signature = sign.toHex();
        this.signature = "";
        this.signedTrx = {};
//        console.log(sign.toHex());
    }
// })
