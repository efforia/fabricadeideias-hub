$.fn.newSelection = function(event){ 
	$.e.selection = true; 
	$(this).showMosaic(event); 
}

$.fn.createSelection = function(event){
	event.preventDefault();
	if(selection == true){
		href = $(this).attr('href');
		if($.e.objects.length < 1) return;
		label = ''; value = '';
		if(href == 'movement'){
			label = 'Nome do seu movimento:';
			value = 'Criar movimento';
		}else if(href == 'schedule'){
			label = 'Nome da sua programação:';
			value = 'Criar programação';
		}
		$(this).children().html('<form method="post" action="/'+href+
		'" style="text-align:center;">'+label+
		' <input name="title" style="width:90%;"></input><div id="botoes"><input name="create" class="ui-button ui-widget ui-state-default ui-corner-all" type="submit" value="'+value+
		'"></div></form>');
		$('input[name=title]').focus();
		$('input[name=create]').click(function(event){
			event.preventDefault();
			title = $('input[name=title]').val()
			if(title == '') return;
			objs = $.e.objects.join();
			$.ajax({
				url:href,
				type:'POST',
				data:{'objects':objs,'title':title},
				beforeSend: function(){ $('#Espaco').Progress(); },
				success: function(data){
					$.get(href,{'view':'view','title':title},function(data){
						$('#Grade').Mosaic(data);
						$('#Espaco').empty().dialog('destroy');
						$.fn.eventLoop();
						$.e.selection = false;
					});
				}
			});
		});
	}
}

$.fn.changeSelection = function(event){
	event.preventDefault();
	$.e.option = $("select option:selected").val();
}

$.fn.sendNewField = function(event){
	event.preventDefault();
	if(event.which != $.ui.keyCode.ENTER) return;
	name = $(this).attr('name');
	value = $(this).val();
	serialized = {};
	serialized['key'] = [name,value] 
	$.post('profile',serialized,function(data){
		$(data).parent().parent().find('#statechange').html('<img src="images/ok.png"></img>');
	});
}

$.fn.submitPasswordChange = function(event){
	$.ajax({
		url:'password',
		success:function(data){
			$('#passwordchange').html(data);
			$('#password').attr('value','Alterar senha');
			$('#password').click(function(event){
				event.preventDefault();
				$.ajax({
					url:'password',
					type:'POST',
					data:$('#passwordform').serialize(),
					beforeSend:function(){
						if($('#id_new_password1').val() != $('#id_new_password2').val()){
							alert('A senha nova está diferente de sua confirmação. Digite novamente.');
							abort();
						}
					},
					success:function(data){
						if(data == 'Senha incorreta.'){
							$('#passwordform').find('#statechange').html('<img src="images/nok.png"></img>');
						}else{
							$('#passwordform').find('#statechange').html('<img src="images/ok.png"></img>');	
						}
					}
				});
			});
		}
	});
}

$.fn.deleteObject = function(event){
	event.preventDefault();
	$.get('delete',{'text':$('#Espaco').find('.time').text()},function(data){
		$.get('/',{'feed':'feed'},function(data){$('#Grade').loadMosaic(data);});
		$('#Espaco').dialog('close');
	});
}

$.fn.getInitialFeed = function(){
	$.ajax({
		url:'/',
		data:{'feed':'feed'},
		beforeSend:function(){ 
			$('#Espaco').Progress();
			$('#Exterior').css({
				'height':$.e.h-40,
				'width':$.e.w*0.84,
				'margin-left':($.e.w*0.16)-30
			});
		},
		success:function(data){
			$.e.initial = true; 
			$('#Grade').Mosaic(data);
			$('#Grade').css({'height':window.innerHeight});
			$('.mosaic-block').mosaic();
			$.fn.eventLoop();
			$.e.initial = false; 
			$('#Espaco').empty().dialog('destroy');
			if($('.mosaic-block-transparent').length) $.e.marginFactor = 0;
		}
	});
}

$.fn.loadProfileObject = function(event){
	event.preventDefault();
	$.get('known',{'info':$(this).find('.name').text()},function(data){ 
		$('#Esquerda').html(data);
		$('.fan').click(function(event){
			event.preventDefault();
			$.get('fan',{'text':$('#fan').text()},function(data){
				$('#Grade').loadMosaic(data);
				$.fn.hideMenus();
			});
		});
	});
	$.ajax({
		url:'known',
		data:{'activity':$(this).find('.name').text()},
		beforeSend:function(){ $('#Espaco').Progress(); },
		success:function(data){	$('#Espaco').empty().dialog('destroy'); $('#Grade').Mosaic(data); }
	});
	$.fn.showMenus();
}

$.fn.loadMosaic = function(data){
	$('#Grade').Mosaic(data);
	$('#Espaco').empty().dialog('destroy');
	$.fn.hideMenus();
	if(!$.e.initial) $('.return').parent().show()
	$.fn.eventLoop();
}

$.fn.loadMoreMosaic = function(event){
	event.preventDefault();
	number = $(this).attr('name');
	$.post($(this).attr('href'),{'number':number},function(data){
		$('#Grade').translate(0,0); $.e.marginTop = 0;
		$('#Grade').loadMosaic(data);
		if($('.blank').text() != '') $.e.marginFactor = 0;
	});
}

$.fn.loadNewDialog = function(event){
	event.preventDefault();
	href = $(this).attr('href');
	$.ajax({
		url:href,
		beforeSend:$.fn.animateProgress,
		success:function(data){
			$('#Espaco').Dialog(data);
			$('#id_username').focus();
		}
	});
}

$.fn.closeDialog = function(event){
	event.preventDefault();
	$('#Espaco').empty().dialog('destroy');
	$('#Player').tubeplayer('destroy');
}

$.fn.backToHome = function(event){
	event.preventDefault();
	$('#Pagina').hide();
	$('body').css({'background':'#222'});
	$('#Pagina,#Rodape').css({'color':'white'})
	setTimeout(function(){
		$('#Central').translate(0,0);
	});
}

$.fn.showMessage = function(event){
	event.preventDefault();
	$('#Direita').animate({'right':'-15%'});
	$('#Direita').animate({'right':'0%'});
}

$.fn.gotoSocial = function(event){
	$(this).redirect(event);
}

$.fn.showMosaic = function(event){
	event.preventDefault();
	$.ajax({
		url:$(this).attr('href'),
		beforeSend:$('#Espaco').Progress(),
		success:function(data){ 
			$('#Grade').loadMosaic(data); 
			$.fn.hideMenus();
			$.fn.eventLoop();
		}
	});
}

$.fn.showContext = function(event){
	event.preventDefault();
	$.ajax({
		url:$(this).attr('href'),
		beforeSend:function(){ $('#Espaco').Progress(); },
		success:function(data){
			$('#Espaco').Context(data,$('#Canvas').height()-10,$('#Canvas').width());
			$('#Abas').Tabs(function(){
				if($('#Canvas').is(':hidden')){$('.ui-dialog').css({'left':0,'width':$('#Grade').width()-5});}
				$('#overlay').hide();
				$('.birthday').datepicker($.e.birthdayOpt);
				$('.deadline').datepicker($.e.deadlineOpt);
				$('.date').datepicker('option',$.datepicker.regional['pt-BR']);
				$('input[type=file]').fileUpload($.e.uploadOpt);
				$.fn.eventLoop();
			},$('#Canvas').height()-40);
		}
	});
}

$.fn.showPlaceView = function(event){
	event.preventDefault();
	$.get('place',{},function(data){
		$('#Espaco').Dialog(data);
		$('.submit').css({'width':50});
		$.fn.eventLoop();
	});
}

$.fn.showLoginView = function(event){
	event.preventDefault();
	$.ajax({url:'login',beforeSend:$.fn.animateProgress,success:function(data){
		$('#Espaco').Dialog(data);
		$('#id_password').on('keypress',function(event){ if(event.which == 13) $('form').submit(); });
		$('.submit').css({'width':50});
		$.fn.eventLoop();
	}});
}
	
$.fn.showRegisterView = function(event){
	event.preventDefault();
	birthday = '<div><label>Aniversário</label><input id="birthday" type="text" class="date"></input></div>'
	$.ajax({url:'register',beforeSend:$.fn.animateProgress,success:function(data){
		$('#Espaco').Dialog(data);
		//$('#Espaco').find('#etiquetas').append(birthday);
		$('#id_birthday').datepicker($.e.birthdayOpt);
		$('#id_birthday').datepicker('option',$.datepicker.regional['pt-BR']);
		$('.submit').css({'width':50});
		$.fn.eventLoop();
	}});		
}

$.fn.slideWhoPage = function(event){
	event.preventDefault();
	$('#Central').translate($.e.w,0);
	setTimeout(function(){
		$('#Pagina').load('templates/start.html #who',function(){
			$('.back').click($.fn.backToHome);
			$('body').css({'background':'#c00'});
			$('#Pagina').show();
		});
	},1000);
}

$.fn.slideWhatPage = function(event){
	event.preventDefault();
	$('#Central').translate(0,$.e.h);
	setTimeout(function(){
		$('#Pagina').load('templates/start.html #what',function(){
			$('.back').click($.fn.backToHome);
			$('body').css({'background':'black'});
			$('#Pagina').show();
		});
	},1000);
}

$.fn.slideHowPage = function(event){		
	event.preventDefault();
	$('#Central').translate(-$.e.w,0);
	setTimeout(function(){
		$('#Pagina').load('templates/start.html #how',function(){
			$('.back').click($.fn.backToHome);
			$('body').css({'background':'white'});
			$('#Pagina,#Rodape').css({'color':'black'});
			$('#Pagina').show();
		});
	},1000);
}

$.fn.hideMenus = function(){
	$('#Canvas').css({'opacity':0,'display':'none'});
	$('#Exterior').css({'opacity':0,'z-index':-1});
	$('.return').parent().show('fade');
	setTimeout(function(){
   	$('#Esquerda,#Sair').translate(-$.e.w*0.16,0);
    $('#Grade').css({'margin-left':'0%'});
  	},500);
}

$.fn.showMenus = function(){
	$('.return').parent().hide('fade');
	setTimeout(function(){
	$('#Esquerda,#Sair').translate(0,0);
    $('#Grade').css({'margin-left':'15%'});
    $('#Canvas').css({'opacity':1,'display':''});
    $('#Exterior').css({'opacity':1,'z-index':1});
  	},500);
}