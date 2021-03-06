this.wimpy = this.wimpy || {};
this.wimpy.extension = this.wimpy.extension || {};
this.wimpy.extension.eq = this.wimpy.extension.eq || {};
this.wimpy.extension.eq.renderers = this.wimpy.extension.eq.renderers || {};

(function() {

    /**
     * Creates a custom graphic equalizer for a wimpy player.
     *
     * @class Flame
     * @package  wimpy.audio.extensions.eq.renderers
     * @constructor
     * 
     * @param {GraphicEq} 	controller 		- The base GraphicEq class that constructs this renderer.
     * @param {object} 		originalParams 	- The original configuration object used during setup.
     * 
     */
    function Flame(controller, originalParams) {
    	this._rangeBuilt = false;
    }

    Flame.defaultOpts = {
        backgroundColor: "#000000",
        //'fillColor: ["#ffffff", "#62B9FD", "#536AA3", "#000000"]
        fillColor: ["#ffffff", "#ffd624", "#f16f63", "#d4338e", "#8d0da6", "#451a88", "#2c1876", "#000000"]
    }




    var p = Flame.prototype;

    p.controller = null;
    p.width = null;
    p.height = null;
    p.canvas = null;
    p.canvasCtx = null;

    p.backgroundColor = null;
    p.lineColor = null;
    p.lineWidth = null;


    /**
     * Called by the controller to render the animation. Called on each tick.
     *
     * @method loop
     * @param  {array} data - An array of frequency data normalized to values between 0 and 1. If the user defined a "scale" configuration property, the value may be larger than 1.
     */

    p.loop = function(data) {
        var ctx = this.canvasCtx;
        var canvas = this.canvas;
        var WIDTH = canvas.width;
        var HEIGHT = canvas.height;
        var HALF_HEIGHT = HEIGHT / 2;

        var bufferLength = data.length;
        var unitSize = Math.ceil(HEIGHT / bufferLength);
        var totalUnits = HEIGHT / unitSize;

        var specSize = 2;

        if (!this._rangeBuilt) {
            this.fillColor = this.controller.tweenGradient(this.fillColor, 100);
            this._rangeBuilt = true;
        }

        var fillColor = this.fillColor; // localize
        var fillColorRange = fillColor.length-1;
        var primaryColor = fillColor[0];

      
        var y = HEIGHT;
        var startPos = WIDTH-specSize;
        var avgData = 0;
        for (var i = 0; i<bufferLength; i++) {

            var val = data[i];
            avgData += val;
            var colorIdx = Math.round(fillColorRange - fillColorRange * val);
            var color = fillColor[colorIdx];
            ctx.fillStyle = color;
            ctx.fillRect(startPos, y, specSize, unitSize);
            y -= unitSize;
        };

        avgData = avgData / bufferLength;

 ctx.save();

		ctx.drawImage(
    		canvas, 	
    		0, 			// s-x
    		0, 			// s-y
    		WIDTH, 		// s-width
    		HEIGHT, 	// s-height
    		-2 * avgData, 	// d-x
    		-(1-avgData),			// d-y
    		WIDTH, 		// d-width
    		HEIGHT		// d-height
    	);


ctx.restore();

	    
	    //ctx.globalCompositeOperation = 'luminosity';
		// paints along a line from (x0, y0) to (x1, y1)
	    var gradient = ctx.createLinearGradient(0, 0, WIDTH-specSize, 0);
        gradient.addColorStop(0, 'rgba(0,0,0,0.018)');
        //gradient.addColorStop(0, 'rgba(0,0,0,0.03)');
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
       ctx.fillStyle = gradient;
		//ctx.fillRect(0, 0, WIDTH-specSize, HEIGHT);

		//ctx.globalCompositeOperation = 'source-atop';
	    	var offset = 0;
	    	ctx.globalAlpha = 0.4; // highr = faster

	    	var w = WIDTH;
	    	var h = HEIGHT;

	    	var sW1;
	    	var sW2;
	    	var sH1;
	    	var sH2;
	    	var sY1;
	    	var sY2;
	    	var dW1;
	    	var dW2;
	    	var dH1;
	    	var dH2;

	    	var bob = 6*(0.5-avgData);

	    		dX1 = 0-bob;
	    		dX2 = 0;
	    		dY1 = 0-bob;
	    		dY2 = 0+bob;
	    		
	    		dW1 = w-1*avgData;
	    		dW2 = w;
	    		dH1 = h;
	    		dH2 = h;

	    		sX1 = 0;
	    		sX2 = 0;
	    		sY1 = 0-bob;
	    		sY2 = 0;
				
				sW1 = w-1;
	    		sW2 = w-1;
	    		sH1 = h-bob;
	    		sH2 = h;

    	for (var i=1; i<=5;i++) {
	    	// d = destination
	    	// s = source
	    	//							dY		dY		dW			dH			sX	sY		sW			sH
	    	//ctx.drawImage(buffer, 	offset, 0,		w-offset-3, h, 			0, 	offset,	w-offset-5, h 		);
    		//ctx.drawImage(buffer, 	0, 		offset, w-3, 		h-offset, 	0, 	0,		w-5, 		h-offset);
      		ctx.drawImage(canvas, 		dX1, dY1, dW1, dH1, sX1, sY1, sW1, sH1 		);
    		ctx.drawImage(canvas, 		dX2, dY2, dW2, dH2, sX2, sY2, sW2, sH2);
      
      	}
	    ctx.globalAlpha = 1;
	    //ctx.globalCompositeOperation = 'source-over';

    }


    p.reset = function() {
        var ctx = this.canvasCtx;
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(0, 0, this.width, this.height);
    }

    wimpy.extension.eq.renderers.Flame = Flame;

}());
