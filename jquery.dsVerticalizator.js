/*
	* dsSizer 1.2
	*
	* Copyright 2017, Denis Stoliarchuk
	* Licensed under the MIT License (LICENSE.txt).
	*
	* Date: Fri Jul 15 21:34:00 2017
*/
(function($){

	$.fn.dsSizer = function (method, options){
	
		if(!this[method])
			throw '$.dsSizer => The jQuery method "' + method + '" you called does not exist';
		
		var settings = $.extend({
			absolute      : false,
			cloned        : false,
			includeMargin : false,
			display       : 'block'
		}, options || {});
	
		var self = this.eq(0);
		var fixIt, restore;
	
		if(settings.cloned === true){
		
			fixIt = function (){
				var style = 'position: absolute !important; top: -9999 !important; ';
				self = self.cloned().attr('style', style).appendTo('body');
			};
		
			restore = function (){ self.remove(); };
			
		}else{
			var tmp   = [],
				style = '',
				hidden;
			
			fixIt = function (){
				hidden = self.parents().addBack().filter(':hidden');
				style += 'visibility: hidden !important; display: ' + settings.display + ' !important;';
				
				if(settings.absolute === true) style += 'position: absolute !important;';
				
				hidden.each(function(){
					var self     = $(this),
						self_style = self.attr('style');
					
					tmp.push( self_style );
					self.attr({style: (self_style)? self_style+';'+style : style});
				});
			};
	
			restore = function (){
				hidden.each( function(i){
					var self  = $( this ),
						_tmp  = tmp[i];
					
					if(_tmp === undefined) self.removeAttr('style');
					else self.attr('style', _tmp);
					
				});
			};
		}
		
		fixIt();
		var size = /(outer)/.test(method) ? self[method](settings.includeMargin) : self[method]();
		restore();
		
		return size;
	}

/* --------------------------------------------------------------------------------------------------------------------------------- */	

/*
	* jquery.dsVerticalizator.js 1.0
	*
	* Copyright 2017, Denis Stoliarchuk
	* Licensed under the MIT License (LICENSE.txt).
	*
	* Date: Fri Jul 15 25:34:00 2017
*/

	$.fn.dsVerticalizator = function(options) {
		var settings = $.extend({
			style:   'top',
			vertical_offset: 0,
			parent: null,
			refresher: 25, 
			def_winload: false
		}, options || {});
		
		return this.each(function(){
			var self   = $(this);
			var timerRef;
			
			var resize = function () {
				var parentHeight = self.parent().dsSizer('height');
				if(settings.parent && self.parents(settings.parent).length)
					parentHeight = self.parents(settings.parent).first().dsSizer('height');
				
				var centered = (parentHeight / 2) - (self.dsSizer('height') / 2);
				var centered_with_opts = centered + parseInt(settings.vertical_offset)
				
				self.css(settings.style, centered_with_opts);
				self.css('position', 'relative');
				
				if (settings.complete !== undefined)
					settings.complete();
			};
		
			$(window).resize(function () {
				clearTimeout(timerRef);
				timerRef = setTimeout(resize, settings.refresher);
			});
			
			if (!settings.def_winload) {
				resize();
			}
			
			$(window).load(function () {
				resize();
			});
		
		});
	
	};

})(jQuery);
