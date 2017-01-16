//slider
$(function(){

	 $('.burger-slider__arrow').on('click',function(event) {
	 	event.preventDefault();

	 	var $this = $(this),
	 		container = $this.closest('.burger-slider-wrap'),
	 		list = container.find('.burger-slider'),
	 		items = list.find('.burger-slider__item'),
	 		activeItem = items.filter('.active'),
	 		reqItem;

	 	var moveSlide = function(reqItem){
		list.stop().animate({'left': -reqItem.index() * 100 + "%"},'500ms');
	 	activeItem.removeClass('active');
	 	reqItem.addClass('active');
		};	 	

	 	if($this.hasClass('burger-slider__arrow-next')){
	 		
	 		reqItem = activeItem.next().length ?  activeItem.next() : items.first();			
	 		moveSlide(reqItem);	 			 		
	 	}
	 	else if($this.hasClass('burger-slider__arrow-prev')){
	 		reqItem = activeItem.prev().length ?  activeItem.prev() : items.last();
	 		 moveSlide(reqItem);
	 	}
	 });

});
//menu horizontal accordion
$(function() {	
	$('.menu-acord__trigger').on('click',function(e) {
		e.preventDefault();
		
		var _this = $(this),
			container = $(_this).closest('.menu-acord'),
			items = $(container).find('.menu-acord__item'),
			activeItems = $(items).filter('.active'),
			activeContent = $(activeItems).find('.menu-acord__content'),
			item = $(_this).closest('.menu-acord__item'),
			content = (item).find('.menu-acord__content');
		if(!item.hasClass('active')){
			items.removeClass('active');
			activeContent.animate({width:'0'});			
			item.addClass('active');
			content.animate({width:'550px'});

		}
		else{
			item.removeClass('active');
			content.animate({width:'0'});
		}
	});

	//click мимо акордиона

	$(document).on('click', function (e) {
		var $this = $(e.target);
		// console.log($this);
		// console.log($this.closest('.menu-acord').length);
		if (!$this.closest('.menu-acord').length) {
			$('.menu-acord__content').animate({
				'width' : '0px'
			});

			$('.menu-acord__item').removeClass('active');
		}
	});



});	
//team accordion
$(function() {	
	var accord = $(".team-acord"),
		accordItems = $(accord).children(),
		trigger = $(accordItems).find('a');
	$(trigger).on('click', function(e){
		e.preventDefault();
		if(!$(this).parent().hasClass('active')){
			$(trigger).siblings().slideUp('400ms');			
			$(accordItems).removeClass('active');			
			$(this).parent().addClass('active');
			$(this).siblings().slideDown('400ms');
		}
		else{
			$(this).parent().removeClass('active');
			$(this).siblings().slideUp('400ms');
			$(trigger).removeClass('trigger__active');
		}
	});
});
//макса телефона
$(function() {
	$('.phone__mask').inputmask('+7 (999) 999 99 99');	
});

//fancybox
$(function () {
	$('.review__button').fancybox({
		type: 'inline',
		maxWidth : 460,			
		fitToView : false,
		padding : 0
	});

	$('.review__full-close').on('click', function(e){
	    e.preventDefault();
		$.fancybox.close();
	});
});
//one page scroll
 $(function() {
 	var sections = $('.section'),
 	 	display = $('.maincontent');
 	 	inScroll = false;

 	

 		
 	var scrollToSection = function (sectionEq){
 	 	var position;

 	 	if(inScroll || sectionEq < 0) return;

 	 	inScroll = true;

 	 	position = (sections.eq(sectionEq).index() * -100) + '%';
 	 	
 	 	sections.eq(sectionEq).addClass('active')
 	 		.siblings().removeClass('active');
 	 		
 	 	display.css({
			'transform' : 'translate3d(0, ' + position + ', 0)'
		});

 	 	setTimeout(function () {
			inScroll = false;

			$('.main-menu__item').eq(sectionEq)
				.addClass('active')
				.siblings()
				.removeClass('active');

		}, 1300);
 	 
 	};


 	 $(document).on({
 	 	 wheel : function(e){ 
	 	 	var deltaY = e.originalEvent.deltaY; 	 		 		
	 	 	var activeSection = sections.filter('.active');
	 	 	var reqSection; 

	 	 	if(deltaY>0){ //вниз 	 		
	 	 		reqSection = activeSection.next().index();
	 	 	}
	 	 	if(deltaY<0){//вверх
	 	 		reqSection = activeSection.prev().index();
	 	 	} 	 		
	 	 		scrollToSection(reqSection);
 	 	},

 	 	keydown : function (e) {

			var activeSection = sections.filter('.active');

			if ($(e.target).is('textarea')) return;

			if (e.keyCode == 38) {// кнопка вверх				
					scrollToSection(activeSection.prev().index());
			}
			if (e.keyCode == 40){// кнопка вниз
				scrollToSection(activeSection.next().index());
			}
		}
	});

 	 $('.arrow-down').on('click',function(e){
 	 	e.preventDefault();
 	 	scrollToSection(1);
 	 });
 	 $('.nav__link').on('click', function(e){
 	 	e.preventDefault();
 	 	var href = parseInt($(this).attr('href'));	 	
 	 	scrollToSection(href);
 	 }) 	 
 	 $('.order-link').on('click', function(e){
 	 	e.preventDefault();
 	 	var href = parseInt($(this).attr('href'));
 	 	scrollToSection(href);
 	 })
 	 $('.main-menu__link').on('click', function(e){
 	 	e.preventDefault();
 	 	var href = parseInt($(this).attr('href'));
 	 	scrollToSection(href);
 	 })

 });

//form submit
$(function() {
	$('#order__form').on('submit',function(e){
		e.preventDefault();
		var form = $(this),
			formData= form.serialize();			
		 $.ajax({
		 	url: '../mail.php',
		 	type: 'POST',		 	
		 	data: formData,
		 	success: function(data) {
		 		console.log(data);
		 		var popup= data.status ? '#success' : '#error',
		 			popup = '#success';


		 		$.fancybox.open([
		 				{href:popup}
		 				],{
		 					type : 'inline',
		 					maxWidth: 250,
		 					fitToView: false,
		 					padding: 0,
		 					afterClose: function(){
		 						form.trigger('reset');
		 					}
		 		});
		 	
		 	}
		 })		 
		 
	});
	$('.status-popup__close').on('click', function(e){
		e.preventDefault();

		$.fancybox.close();
	});
});

//yandex map
$(function () {
	ymaps.ready(init);
	var myMap;
	function init(){
		myMap = new ymaps.Map("map", {
			center: [59.93916998692174,30.309015096732622],
			zoom: 11,
			controls : [],
		});

		var coords = [
				[59.952371, 30.308496],
				[59.945735, 30.465770],
				[60.005229, 30.229080],
				[59.867845, 30.261104],
			],
			myCollection = new ymaps.GeoObjectCollection({}, {
				draggable: false,
				iconLayout: 'default#image',
				iconImageHref: 'content/icons/map-marker.svg',
				iconImageSize: [46, 57],
				iconImageOffset: [-26, -52]
			});

		for (var i = 0; i < coords.length; i++) {
			myCollection.add(new ymaps.Placemark(coords[i]));
		}

		myMap.geoObjects.add(myCollection);

		myMap.behaviors.disable('scrollZoom');
	}
});

