var videoViewer = {
	UI : {
		playerTemplate : '<video controls="controls" id="videoStream"></video>',
		show : function () {
			$('<div id="videoviewer_overlay" style="display:none;"></div><div id="videoviewer_popup"><div id="videoviewer_container"><a class="box-close" id="box-close" href="#"></a></div></div>').appendTo('body');
			
			$('#videoviewer_overlay').fadeIn('fast',function(){
				$('#videoviewer_popup').fadeIn('fast');
			});
			$('#box-close').click(videoViewer.hidePlayer);
			var size = videoViewer.UI.getSize();
			var playerView = videoViewer.UI.playerTemplate;
			$(playerView).prependTo('#videoviewer_container');
		},
		hide : function() {
			$('#videoviewer_popup').fadeOut('fast', function() {
				$('#videoviewer_overlay').fadeOut('fast', function() {
					$('#videoviewer_popup').remove();
					$('#videoviewer_overlay').remove();
				});
			});
		},
		getSize : function () {
			var size;
			if ($(document).width()>'680' && $(document).height()>'520' ){
				size = {width: 640, height: 480};
			} else {
				size = {width: 320, height: 240};
			}
			return size;
		},
	},
	mime : null,
	file : null,
	own : null,
	apath : null,
	downP : null,
	location : null,
	player : null,
	mimeTypes : [
		'video/mp4',
		'video/webm',
		'video/x-flv',
		'application/ogg',
		'video/ogg',
		'video/quicktime',
		'video/x-msvideo',
		'video/x-matroska',
		'video/x-ms-asf',
		'video/3gpp'
	],
	onView : function(file,mime,own,apath,downP) {
		videoViewer.file = file;
		videoViewer.location = videoViewer.getMediaUrl(file);
		videoViewer.mime = mime;
		videoViewer.own = own;
		videoViewer.downP = downP;
		videoViewer.apath = apath;
		
		OC.addScript('vids','jwplayer.html5');
		OC.addScript('vids','jwplayer', videoViewer.showPlayer);
		
	},
	showPlayer : function() {
		videoViewer.UI.show();
		
		videoViewer.player = true;
		
		var extM = videoViewer.mime.split('/');
		
		var ext = '';
		
		switch (extM[1]){
		
			case 'mp4':ext = 'mp4';break;
			case 'webm':ext = 'webm';break;
			case 'x-flv':ext = 'flv';break;
			case 'ogg':ext = 'ogg';break;
			case 'quicktime':ext = 'mp4';break;
			case 'x-msvideo':ext = 'avi';break;
			case 'x-matroska':ext = 'mkv';break;
			case 'x-ms-asf':ext = 'asf';break;
			case '3gpp':ext = '3gp';break;
		
		
		}
		
		
		if(ext === ''){
		
			switch(videoViewer.mime){
			
				case '12':ext='mp4';break;
			
			}
		
		}
		
		
		var user = $('title').html().split('(')[1].replace(')','').trim();
		
		var fileName = videoViewer.file;
		var own = videoViewer.own;
		
				
		var streamPath = videoViewer.downP;
		
		
		var flashLOC = OC.filePath('vids', 'js', 'jwplayer.flash.swf');
		
		
		jwplayer("videoStream").setup({
			modes:[
				{type: 'html5' },
				{type: 'flash', src: flashLOC}
			],
			file: streamPath,
			width: 640,
			height: 480,
			autostart: true
		});
		
		
		
	},
	hidePlayer : function() {
		videoViewer.player = false;
		delete videoViewer.player;

		videoViewer.UI.hide();
	},
	getMediaUrl : function(file) {
		var dir = $('#dir').val();
		return fileDownloadPath(dir, file);
	},
	onKeyDown : function(e) {
		if (e.keyCode == 27 && videoViewer.player) {
			 videoViewer.hidePlayer();
		}
	},
	log : function(message){
		console.log(message);
	}
};



//
var Vids = {};
Vids.videos = [];
Vids.users = [];
Vids.displayNames = [];

Vids.sortFunction = function(a,b){

	return a.toLowerCase().localeCompare(b.toLowerCase());

}

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};



function genThumb(URL,name,own){

	$.ajax({
		type:"POST",
		async:true,
		dataType:"json",
		url:OC.filePath('vids', 'ajax', 'generateThumb.php'),
		data:{vidURL:URL,vidN:name,vidO:own},
		success:function(data){
		},
		error:function(request,status,error){alert(request.responseText);}
	
	});


}


$(document).ready(function() {

	
	
	$('#breadcrumbs').append('<div class="crumb last"><a href="#">Videos</a></div>');
	
	


	$.getJSON(OC.filePath('vids', 'ajax', 'getvideos.php')).then(function (data) {
	
		var count = 0;
	
		$.each(data.videos,function(k,v){
			var vName = v.name;
			var absPath = v.path;
			
			var whereSlash = v.rawPath.indexOf("/");
			var downPath = v.rawPath.substring(whereSlash,v.rawPath.length);
			
			
			if (downPath.indexOf("Shared/") >= 0){
			
				downPath = downPath.replace("files/","");
			
			}
			
			
			
			if (v.path.indexOf("Shared/") >= 0){
				
				vName = "Shared/"+encodeURIComponent(vName);
			
			}else{
			
				vName = "";
				var tmp = v.path.split("/");
				
				for(i = 1; i < tmp.length-1; ++i){
				
					vName += tmp[i]+"/";
				
				}
				
				vName += encodeURIComponent(tmp[tmp.length-1]);
				
			
			}
			var row = $('<tr></tr>');
			row.attr('data-size',v.size);
			row.attr('data-action','View');
			row.attr('data-mime',v.mimetype);
			row.attr('data-type','file');
			row.attr('data-file',v.name);
			row.attr('data-id',v.fileid);
			row.attr('data-own',v.realOwner);
			row.attr('data-abs',absPath);
			
			var cell = $('<td></td>');
			cell.addClass('filename');
			
			
			var baseVid = OC.filePath('vids', 'stos', '.')+'/';
			
			$.ajax({
			
				url: baseVid+v.realOwner+'::'+encodeURIComponent(v.name)+'.png',
				type:'HEAD',
				async:true,
				error:function(){
				
					genThumb(absPath,v.name,v.realOwner);
				
				},
				success: function(){
				
				
				}
			
			
			});
			
			
			
			var imgURL = baseVid+v.realOwner+'::'+encodeURIComponent(v.name)+'.png';
			
			var link = $('<a href="#"></a>');
			link.attr('name','/owncloud/index.php/apps/files/download/'+downPath);
			link.html('<img class="thumbss" style="background:url(\''+imgURL+'\');background-size:100% 100%;background-repeat:no-repeat" src="'+OC.filePath('vids', 'img', 'bay_play.png')+'" />');
			link.css('margin-left','10px');
			link.addClass('viewVid');
			
			link.click(function(){
			
				videoViewer.onView($(this).parent().parent().attr('data-file'),
									$(this).parent().parent().attr('data-mime'),
									$(this).parent().parent().attr('data-own'),
									$(this).parent().parent().attr('data-abs'),
									$(this).attr('name'));
			
			});
			
			cell.append(link);
			
			var videoTitle = v.name;
			
			if (videoTitle.length > 20){
			
				videoTitle = videoTitle.substring(0,20)+"...";
			
			}
			
			
			cell.append('<br/><span class="fileName">'+videoTitle+'</span>');
			
			row.append(cell);
			
			
			
			$('#vids').append(row);
			
			
			
		
		});
		
		
		$('#vids tbody tr:nth-child(4n)').after('<br/>');
		
		
		
		
	});
	
	

});

