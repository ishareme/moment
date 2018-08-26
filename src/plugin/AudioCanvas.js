function AudioCanvas(opt) {

    this.init(opt);
}

AudioCanvas.prototype = {
    init(opt){
        this.src = opt.src

        this.createCanvas(opt)

    },
    createCanvas(opt){
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = opt.width;
        this.canvas.height = opt.height

        this.preApi()
    },
    preApi(){
        //获取API
        var AudioContext = AudioContext || webkitAudioContext;
        this.audioContext = new AudioContext;
        //加载媒体
        this.audio = new Audio(this.src);
        //创建节点
        var source =  this.audioContext.createMediaElementSource(audio);
        this.analyser =  this.audioContext.createAnalyser();
        //连接：source → analyser → destination
        source.connect(this.analyser);
        this.analyser.connect( this.audioContext.destination);
        this.output = new Uint8Array(360);
        var du = 2;//角度
        var potInt = { x: 300, y: 300 };//起始坐标
        var R = 200;//半径
        var W = 4;//宽
        this.drawSpectrum(du,potInt,R,W)
    },
    drawSpectrum(){
        this.analyser.getByteFrequencyData(output);//获取频域数据
        this.cxt.clearRect(0, 0, wrap.width, wrap.height);
        //画线条
        for (var i = 0; i < 180; i++) {
            var value = this.output[i] / 10;//<===获取数据
            this.cxt.beginPath();
            this.cxt.lineWidth = W;
            Rv1 = (R -value);
            Rv2 = (R +value);
            this.cxt.moveTo(( Math.sin((i * du) / 180 * Math.PI) * Rv1 + potInt.y),-Math.cos((i * du) / 180 * Math.PI) * Rv1 + potInt.x);
            this.cxt.lineTo( ( Math.sin((i * du) / 180 * Math.PI) * Rv2 + potInt.y),-Math.cos((i * du) / 180 * Math.PI) * Rv2 + potInt.x);
            this.cxt.stroke();
        }
        this.cxt.fill();
        //画一个空心小圆，将线条覆盖
        this.cxt.beginPath();
        this.cxt.lineWidth = 1;
        this.cxt.arc(300, 300, 200, 0, 2 * Math.PI, false);
        this.cxt.stroke();
        this.cxt.closePath();
        //请求下一帧
        requestAnimationFrame(this.drawSpectrum);
    }
}
