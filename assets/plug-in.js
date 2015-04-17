var jqteStatus = true;
var paraHeading = '<input type="text" class="heading-text" value="Paragraph Heading">';
var bodyContent = '<textarea name="textarea" class="jqte-test"></textarea>';

var textColor = "#333";
var fontFace = "arial, sans-serif";
var styleParaContent = {"font-size": "14px", "color": textColor, "font-family": fontFace};
var styleH1 = {"font-size": "24px", "font-family": fontFace, "font-weight": "bold", "line-height": "24px"};
var styleH2 = {"font-size": "19px", "color": textColor, "font-family": fontFace, "font-weight": "bold"};
var styleH3 = {"font-size": "15px", "color": textColor, "font-family": fontFace, "font-weight": "bold"};
var styleP = {"font-size": "14px", "color": textColor, "font-family": fontFace, "padding": 0, "margin": "0 0 10px 0"};
var styleLi = {"font-size": "14px", "color": textColor, "font-family": fontFace};
var sponsors = {};
$( document ).ready(function() {

	// Assign handlers immediately after making the request,
	// and remember the jqxhr object for this request
	$.getJSON( "components/celiacsponsors/sponsors.json", function(result) {
	   sponsors = result.sponsor;

	}).done(function(){
	    $.each(sponsors, function(i, sponsor){
		$("#sponsorList").append("<option value='" + sponsor.id + "'>" + sponsor.name + "</option>");
	    });
	})


	$('.output .jqte-test').jqte();
	disableContentEdit();
	//toggle html and editor
  	$(".status").click(function()
		{
			if(jqteStatus){
				jqteStatus = false;
				$('#content-box .jqte-test').jqte({"status" : false});
				$('.status').text('Edit');
			}else{
				jqteStatus = true;
				$('#content-box .jqte-test').jqte({"status" : true});
				$('.status').text('View HTML');
			}
			//disable edit for output textarea
			disableContentEdit();
		}
	);
  	//generate paragraph containers
	$("#updateBtn").click(function()
		{
			var r=confirm("Are you sure?! Reset will erase all your existing content");
			if (r==true)
			{
			  if($('#paraNum').val() >0 && $('#paraNum').val()<=15){
					var content = '';
					for (var i = 0; i < $('#paraNum').val(); i++) {
						content += "<div class='para-section'><h2>Paragraph Section</h2>" + paraHeading + bodyContent + "</div>";
					};
					$('#content-box').html(content);
					$("#content-box .jqte-test").jqte();
					$(".para-section").each(function(){
						$(this).find('.jqte_editor').html("<p>Please enter the content for this paragraph...</p>");
					})
					jqteStatus = true;
					//disable edit for output textarea
					disableContentEdit();
    				$("#export").addClass("highlight");
				}
			}
			else
			{
			  //do nothing
			}
		}
	);
	//import html
	$("#importBtn").click(function()
		{

			var paraNumber = $('#import-content-box').find('.para-box').length;
			if(paraNumber >0 && paraNumber<=15){
				var content = '';
				for (var i = 0; i < paraNumber; i++) {
					content += "<div class='para-section'><h2>Paragraph Section</h2>" + paraHeading + bodyContent + "</div>"
				};
				$('#pubDate').val('');
				$('#pubDate').val($('.publication-date').text());
				$('#content-box').html(content);
				$("#content-box .jqte-test").jqte();
				for (var i = 0; i < paraNumber; i++) {
					$($('.heading-text').get(i)).val($($('.para-title').get(i)).text())
				};
					
				$(".para-section").each(function(){
					$(this).find('.jqte_editor').html($($('.para-content').get($(this).index())).html());
				})
				//jqteStatus = true;
				//disable edit for output textarea
				disableContentEdit();
				$("#export").addClass("highlight");
			}
			
		}
	);
	//Read file from local drive
  	$('#files').on( "change", handleFileSelect);
  	$('#quickLinkCheckBox, #themeSelected').change(function() {
  		$("#export").addClass("highlight");
	});
	//document.getElementById('files').addEventListener('change', handleFileSelect, false);
	//generate html
	$("#export").click(function()
		{
			$("#export").removeClass("highlight");
			$('.jqte-test').jqte();
			var content = '';
			if($('#pubDate').val().length != 0){
				content = '<div class="date-box"><span class="publication-date">' + $('#pubDate').val() + '</span></div><hr>';
			}
			if($('#quickLinkCheckBox').prop('checked')){
				content += '<div class="quick-links"><span>In This Issue</span><ul>';
				$(".para-section").each(function() {

					content += ('<li class="quick-link-item" id="quickLink' + $(this).index() + '"><a href="#link-' + $(this).index() + '">' + $(this).find('.heading-text').val() + '</a></li>');
	    			
				})
				content += '</ul></div><hr>';
			}
			$(".para-section").each(function() {
				if(($(".para-section").length - $(this).index()) > 1){
					content += ('<div class="para-box" id="paraNum' + $(this).index() + '"><h1 class="para-title"><a href="#" name="link-' + $(this).index() + '"></a>' + $(this).find('.heading-text').val() + '</h1><div class="para-content">' + $(this).find('.jqte-test').text() + '</div></div><br><hr>');
    			}else{
    				content += ('<div class="para-box" id="paraNum' + $(this).index() + '"><h1 class="para-title"><a href="#" name="link-' + $(this).index() + '"></a>' + $(this).find('.heading-text').val() + '</h1><div class="para-content">' + $(this).find('.jqte-test').text() + '</div></div>');
    			}
			})

			$('.html-code').text(content);
			//disable edit for output textarea
			$('.jqte-test').jqte();
			if($('#themeSelected').val() != 'sample'){
				addInlineCSS($('#themeSelected').val());
			}
			disableContentEdit();

		}
	);
	//toggle sponsor list for celiac
  	$("#themeSelected").change(function()
		{
			if($(this).val() == 'celiac'){
				$('#sponsorControl').show();
			}else{
				$('#sponsorControl').hide();
			}
		}
	);
	$('#download').click(function(evt)
		{
			var dNow = new Date();
			var fileNameStr = $('#themeSelected').val() + '_newsletter_'+(dNow.getMonth()+ 1) + '_' + dNow.getDate() + '_' + dNow.getFullYear() + '.html';
			var DOWNLOAD_CONTENT = '';

			DOWNLOAD_CONTENT = $('.output .jqte_editor').html();
			DOWNLOAD_CONTENT = DOWNLOAD_CONTENT.replace(/\’/g, "'");
			DOWNLOAD_CONTENT = DOWNLOAD_CONTENT.replace(/\”/g, '"');
			DOWNLOAD_CONTENT = DOWNLOAD_CONTENT.replace(/\“/g, '"');
			DOWNLOAD_CONTENT = DOWNLOAD_CONTENT.replace(/–|—/g, '--');
			DOWNLOAD_CONTENT = DOWNLOAD_CONTENT.replace(/®/g, "&reg;");
			DOWNLOAD_CONTENT = DOWNLOAD_CONTENT.replace(/™/g, "&trade;");
			DOWNLOAD_CONTENT = DOWNLOAD_CONTENT.replace(/½/g, "&frac12;");
			DOWNLOAD_CONTENT = DOWNLOAD_CONTENT.replace(/¼/g, "&frac14;");
			DOWNLOAD_CONTENT = DOWNLOAD_CONTENT.replace(/¾/g, "&frac34;");
			DOWNLOAD_CONTENT = DOWNLOAD_CONTENT.replace(/⅛/g, "&frac18;");
			DOWNLOAD_CONTENT = DOWNLOAD_CONTENT.replace(/é/g, "&eacute;");

			$.generateFile({
				filename	: fileNameStr,
				content		: DOWNLOAD_CONTENT,
				script		: 'download.php'
			});
			
			evt.preventDefault();
		}
	);
	$('#addPara').click(function(evt)
		{
			evt.preventDefault();
			var paraNum = $("#content-box .para-section").length;
			$('#content-box').append("<div class='para-section'><h2>Paragraph Section</h2>" + paraHeading + bodyContent + "</div>");
			$('#paraNum').val(paraNum + 1);
			if(jqteStatus){
				$("#content-box .jqte-test").last().jqte()
				$("#content-box .para-section").last().find('.jqte_editor').html("<p>Please enter the content for this paragraph...</p>");
			}else{
				$("#content-box .jqte-test").last().html("<p>Please enter the content for this paragraph...</p>");
			}
			$("#export").addClass("highlight");
		}
	);
	$('#addSponsor').on('click', function(evt)
		{
			evt.preventDefault();
			if($('#sponsorSection').length > 0){
				$('#sponsorSection').remove();
			}
			var paraNum = $("#content-box .para-section").length;
			$('#content-box').append("<div class='para-section' id='sponsorSection'><h2>Sponsor Section</h2>" + paraHeading + bodyContent + "</div>");
			$('#paraNum').val(paraNum + 1);
			if(jqteStatus){
				$("#content-box .jqte-test").last().jqte()
				$("#content-box .para-section").last().find('.jqte_editor').html("<table border='0' cellspacing='0' cellpadding='0' width='100%'><tbody><tr><td width='30%' align='center'><a href='" + sponsors[$('#sponsorList').val()].url + "' target='_blank'><img src='" + sponsors[$('#sponsorList').val()].image + "' alt='" + sponsors[$('#sponsorList').val()].imageAlt + "'></a></td><td width='1%' align='center'>&nbsp;</td><td valign='top'><p><strong>" + sponsors[$('#sponsorList').val()].name + "</strong></p><p>" + sponsors[$('#sponsorList').val()].description + "</p></td></tr></tbody></table>");
			}else{
				$("#content-box .jqte-test").last().html("<table border='0' cellspacing='0' cellpadding='0' width='100%'><tbody><tr><td width='30%' align='center'><a href='" + sponsors[$('#sponsorList').val()].url + "' target='_blank'><img src='" + sponsors[$('#sponsorList').val()].image + "' alt='" + sponsors[$('#sponsorList').val()].imageAlt + "'></a></td><td width='1%' align='center'>&nbsp;</td><td valign='top'><p><strong>" + sponsors[$('#sponsorList').val()].name + "</strong></p><p>" + sponsors[$('#sponsorList').val()].description + "</p></td></tr></tbody></table>");
			}
			$("#content-box .para-section").last().find('.heading-text').val('Vendor Spotlight');
			$("#export").addClass("highlight");
		}
	);
	$('#removePara').click(function(evt)
		{
			evt.preventDefault();
			if($("#content-box .para-section").length > 0){
				$("#content-box .para-section").last().remove();
				$('#paraNum').val($("#content-box .para-section").length);
			}else{
				alert('No more paragraph can be removed!');
			}
			$("#export").addClass("highlight");
		}
	);
});

function addInlineCSS(theme) {
	//console.log(theme);
	var colorH1 = {"color": "#2082cb"};
	//reset all inline CSS
	$('.output .jqte_editor').find('*').removeAttr('style');
	//add inline CSS
	$('.output .jqte_editor .date-box').css({"text-align": "right", "font-size": "18px", "font-family": fontFace, "line-height":"20px"});
	$('.output .jqte_editor .quick-links span').css({"color":"#746661", "font-family": fontFace, "font-size":"16px", "font-weight":"bold"});
	$('.output .jqte_editor').find('.para-content').css(styleParaContent);
	$('.output .jqte_editor').find('h1').css(styleH1);
	$('.output .jqte_editor').find('h2').css(styleH2);
	$('.output .jqte_editor').find('h3').css(styleH3);
	$('.output .jqte_editor').find('p').css(styleP);
	$('.output .jqte_editor').find('li').css(styleLi);

	switch(theme)
	{
		case "celiac":
		  colorH1 = {"color": "#2082cb"};
		  break;
		case "be":
		  colorH1 = {"color": "#da291c"};
		  break;
		case "ap":
		  colorH1 = {"color": "#da291c"};
		  break;
		case "diabetes":
		  colorH1 = {"color": "#2082cb"};
		  break;
		default:
	}

	$('.output .jqte_editor').find('h1').css(colorH1); //general h1
	$('.output .jqte_editor #paraNum0').find('h1').css(colorH1);//welcome color
	$('.output .jqte_editor .publication-date').css(colorH1); //pub date 
	
}

function disableContentEdit() {
	$('.output').find('.jqte_toolbar').hide();
	$('.output').find('.jqte_editor').attr("contenteditable","false");
	$('.html-code').attr("disabled", "disabled");
}

function handleFileSelect(evt) {
	var files = evt.target.files; // FileList object
	// Loop through the FileList and render image files as thumbnails.
	for (var i = 0, f; f = files[i]; i++) {
	// Only process image files.
		if (!f.type.match('text/html') && !f.type.match('text/plain')) {
			continue;
		}

		var reader = new FileReader();
		// Closure to capture the file information.
		reader.onload = (function(theFile) {
			return function(e) {
				// Render thumbnail.
				$('#import-content-box').html(e.target.result);
				if($('#import-content-box').find('.para-box').length <= 0){
					$('#import-content-box').html('');
				}          
			};
		})(f);

		// Read in the image file as a data URL.
		reader.readAsText(f);

	}
}