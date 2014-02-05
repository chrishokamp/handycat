
// XLIFF content
var xliff_doc = null;
var segments = [];

var current_context = 0;
var current_page = 0;
var total_pages = 0;

// Example files
var example_path = "examples/";
var task_path = "examples/tasks/";
var lang_path = "es/";
var xliff_file = "";

// stats
var current_segment = 0;
var translated_segments = {};
var first_time = false;
var was_first_time = false;

// project info
var project_name = "";
var f = null;
var source_lang = null;
var target_lang = null;

var user_nickname = "";

$(document).ready(function(){

  // Check for the various File API support.
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    // Great success! All the File APIs are supported.
  } else {
    alert('The File APIs are not fully supported in this browser.');
  }

  $('#file-input').change(read_file);

  $('#b-create-project').click(function() {
    project_name = $('#project-name').val();
    // init project
    project_setup();
  });

  $(document).on('change', '#task-target-lang', function(evt) {
    var task_target_lang = $('#task-target-lang').val();
    save_language_preference(task_target_lang);
    set_target_lang(task_target_lang);
    console.log("Changed language path to: " + lang_path);
  });

  // setting language preferences if exists
  var pref_target_lang = get_language_perference();
  if (pref_target_lang) {
    $('#task-target-lang').val(pref_target_lang);
    $('#task-target-lang').change();
  }

  // Chris: what are these used for?
  $('#b-next').click(show_next_page);
  $('#b-previous').click(show_previous_page);
  $('#b-previous-notification').click(show_previous_page);

  $(document).on('click', '#b-download-xliff', download_xliff);

  $(document).on('click', '#b-show-xliff', show_file);

  // sliding panel
  $(document).on('click', '#b-project_info', show_project_info_panel);

  // alt-trans events
  $(document).on('click', '#b-select-altrans', select_alt_trans);

  $(document).on('click', '#b-edit-profile', edit_user_profile);

  $(document).on('click', '#b-profile-info', show_user_info);

  $(document).on('click', '#b-profile-stats', show_user_stats);

  $(document).on('click', '#b-profile-prefs', show_user_prefs);

  $(document).on('click', '#b-save-prefs', save_user_prefs);

  $(document).on('focus', '#target', function() {
    var seg_id = $(this).attr('data-segid');
    update_current_segment(parseInt(seg_id));
    console.log("Current segment is: "+ seg_id);

    $('tr').removeClass("row-hover");
    $(this).closest('tr').addClass("row-hover");

  });

  $(document).on('click', 'tbody > tr', function() {
    $('tr').removeClass("row-hover");
    $(this).addClass("row-hover");
    
    var seg_id = parseInt(($(this).children(0).html()));
    update_current_segment(parseInt(seg_id));
    console.log("Current segment is: "+ seg_id);
  });


  // Chris: this is related to the current user
  // user info
  //user_nickname = $('#user-nickname').html();
  //user_info = $('#profile-panel').html();

  // retrieve user information
  //get_db_user_model();

});

// Chris: select an alternate translation
function select_alt_trans() {
  // log aui event
  aui.logger.add_click(B_SELECT_ATRANS);

  aui.logger.increase_selected_atrans();

  var segid = parseInt($(this).attr('data-segid'));
  var alt_trans_id = parseInt($(this).attr('data-atid'));

  console.log("Selected atrans " + alt_trans_id + " of seg " + segid);

  var segment = segments[segid];

  var available_trans = segment.available_trans;
  var alt_trans = available_trans[alt_trans_id];
  var alt_trans_text = alt_trans.content;
  // add text to target textarea
  populate_target(alt_trans_text, segid);

  if (!segment.target_info)
    segment.target_info = {};

  var current_target = segment.target_info;

  // update current target
  current_target.content = alt_trans_text;
  current_target.prov_ref = alt_trans.provenance.records_ref;
  current_target.mt_confidence = alt_trans.mt_confidence;
  current_target.alt_trans = true;
  // save original altrans content to detect modifications
  current_target.alt_trans_content = $.trim(alt_trans_text);
  
  // save atrans as a valid target
  $('#atrans_diag').dialog('close');
  save_target(segid);


  return false;
}

function insert_new_target(target_text, segment_id){

  // add segment to translated segment list
  var trans_seg = {};
  trans_seg.id = segment_id;
  trans_seg.words = get_n_words(target_text);

  // Chris: index into the current mark target (that's how we update the final xliff)
  var mrk_target = get_mrk_target(xliff_doc, segments[segment_id]);
  if (!mrk_target) {
    console.log("Creating new mrk/target");
    // no previous mrk/target node
    // create new one
    mrk_target = create_new_mrk_target(xliff_doc, segments[segment_id], target_text, target_lang);
  }
  // save new content
  mrk_target.textContent = target_text;

  // provenance
  // remove previous provenance info on node if exists
  remove_provenance_crossref(mrk_target);
  remove_inline_provenance(mrk_target);  

  var current_target = segments[segment_id].target_info;
  var provenance = null;

  if (current_target) {
    provenance = current_target.prov_ref;
    // special case: altrans
    // target copied/modified from altrans
    // copying its metadata
    if (current_target.mt_confidence)
      its_insert_mtconfidence(mrk_target, current_target.mt_confidence);
    // No modified altrans
    if (current_target.alt_trans && target_text == current_target.alt_trans_content) {
      // update/add provenance crossref on target/mrk
      if (provenance) add_provenance_crossref(mrk_target, provenance);
      
      // save as translated segment
      trans_seg.by_user = false;
      // target was selected from atrans and not modified
      trans_seg.atrans = true;
      translated_segments[segment_id] = trans_seg;

      aui.logger.increase_translated_seg();

      return; // exit without updating stats    
    }    
  }

  // normal case: user modified/insert target 
  if (provenance) {
    console.log("Updating existing provenance: " + provenance);
    // update existing provenance information
    update_prov_record(provenance);
    // update/add provenance crossref on target/mrk
    add_provenance_crossref(mrk_target, provenance);
  }
  else {
    // create & insert new provenance information
    var new_prov_record_id = create_new_prov_record(xliff_doc);
    // add provenance crossref on target/mrk
    add_provenance_crossref(mrk_target, new_prov_record_id);
    console.log("Creating new provenance: " + new_prov_record_id);
  }

  // save as translated segment
  trans_seg.by_user = true;
  trans_seg.atrans = false;
  translated_segments[segment_id] = trans_seg;

  // AUI logging
  var n_words = get_n_words(target_text);
  aui.logger.increase_translated_words(n_words);
  aui.logger.increase_translated_seg();

}

function get_n_words(text) {
  return text.split(/\s+/).length;
}

// Chris: setup the project - this part is a mess!
function project_setup() {

  // Chris - call this when user exits
  jQuery(window).bind(
      "beforeunload", 
      function() {
          // send user model to the server before user leaves the app
          aui.logger.save_user_model_on_server();
          // Chris: warn user
          return "Attention! You will lost all not downloaded xliff files";
      }
  );

  jQuery('form').submit(function() {
      jQuery(window).unbind("beforeunload");
  });

  // Chris: when creating a new project, why doesn't the project load - Answer: it does load, but my <source> segments don't have <mrk> tags
  if (project_name == "")
    project_name = "Default project";
  console.log("Creating project: " + project_name );

  // get source & target languages
  var file = xliff_doc.querySelector("file");
  source_lang = file.getAttribute("source-language");
  target_lang = file.getAttribute("target-language");

  // get source segments
  // Chris - what is meant by "translatable" here - why do we only extract the <mrk></mrk> tags?
  // We should extract the <source> tags, and then the <mrk> tags -- See the matecat XML parsing for a better(?) implementation
  segments = get_translatable_segments(xliff_doc);

// Chris: why this method of getting the number of segments per page? - for the AUI tools?
  SEGMENTS_PER_PAGE = aui.apply_rule(aui.rules[EXP_NUMBER_SEG_PER_PAGE]);
  console.log("Seg per page:" + SEGMENTS_PER_PAGE);
  total_pages = Math.ceil(segments.length / SEGMENTS_PER_PAGE);
  if (total_pages <= 0)
    total_pages = 1;
  console.log("Content nav - Total pages: " + total_pages);
  update_current_segment(0);
  //show_project_info();

  // Chris: currently requires segments to be in <mrk></mrk> tags
// TODO: get the stuff within raw <source></source> tags too - how does matecat do both?
  for (var i=0; i<segments.length; i++) {
    var target = get_mrk_target(xliff_doc, segments[i]);

    if (target) {
      var segment_id = i;
      // add segment to translated segment list

      // Chris: simple object to represent a translation unit/segment
      var trans_seg = {};
      trans_seg.id = segment_id;
      // segment already translated when processed by the tool
      trans_seg.by_user = false;
      trans_seg.words = get_n_words(target.textContent);
      trans_seg.atrans = false;

      translated_segments[segment_id] = trans_seg;
    }
  }

}

function show_file() {
  console.log("Showing XLIFF");
  var serializer = new XMLSerializer();
  var xliff_str = serializer.serializeToString(xliff_doc);
  window.open("data:text/xml;charset=utf-8," + encodeURIComponent(xliff_str));    
}

function download_xliff() {
  console.log("Downloading XLIFF");
  var serializer = new XMLSerializer();
  var xliff_str = serializer.serializeToString(xliff_doc);

  var file_url = "data:text/xml;charset=utf-8," + encodeURIComponent(xliff_str); 
  var file_name = project_name + '.xlf';

  // Chris: use the method below to download the xliff file
  download_file(file_url, file_name);
}

function download_file(fileUrl, fileName) {
  var save = document.createElement("a");
  save.href = fileUrl;
  save.target = "_blank";
  // Chris: uses the HTML5 download attribute - http://davidwalsh.name/download-attribute
  save.download = fileName || fileUrl;

  var evt = document.createEvent('MouseEvents');
  evt.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, 
                      false, false, false, false, 0, null);

  // Chris: why simulate this click event - Answer: create an <a> at the very corner, then click it to download
  save.dispatchEvent(evt);

  // Chris: this releases the objectURL for the downloaded file object - see https://developer.mozilla.org/en-US/docs/Web/API/URL.revokeObjectURL
  window.URL.revokeObjectURL(save.href);
}


function read_file(evt) {
  var files = evt.target.files; // FileList object
  var f = files[0]; 
  var reader = new FileReader();

  // closure to capture the file information.
  // Chris: where / when is this called?
  reader.onloadend = function(evt) {

  // Chris: this is where the xliff doc object is initialized

    if (evt.target.readyState == FileReader.DONE) { // DONE == 2
      var xliff_file_str = evt.target.result;
      // parse XML from string to DOM format
      var oParser = new DOMParser();
      xliff_doc = oParser.parseFromString(xliff_file_str, "text/xml");
      // print the name of the root element or error message
      // Chris: error checking is done in this way because of a bug in DOMParser - see: https://developer.mozilla.org/en-US/docs/Web/API/DOMParser
      if (xliff_doc.documentElement.nodeName == "parsererror")
        console.log("Error while parsing XLIFF file");
    }
  };

  // Chris: where is this returned?
  reader.readAsText(f, "utf-8");
}

function load_local_file(filepath) {
  // Chris: if filepath exists
  if (filepath) xliff_file = filepath;

  // This will make the request, then start the project
  $.ajax({
    url: xliff_file,
    success: on_xliff_file_sucess,
    dataType: "text"
  });
}

function download_local_file(filepath) {
  if (filepath) xliff_file = filepath;

  $.ajax({
    url: xliff_file,
    success: on_xliff_download_file_sucess,
    dataType: "text"
  });
}

function on_xliff_download_file_sucess(data) {
  var file_url = "data:text/xml;charset=utf-8," + encodeURIComponent(data); 
  var file_name = 'source-file' + '.xlf';

  download_file(file_url, file_name);
}

// Chris: this is IMPORTANT, since it calls project_setup()
function on_xliff_file_sucess(data) {
    // parse XML from string to DOM format

    // Chris: this code is duplicated from line 727
    var oParser = new DOMParser();
    xliff_doc = oParser.parseFromString(data, "text/xml");
    // print the name of the root element or error message
    if (xliff_doc.documentElement.nodeName == "parsererror")
      alert("Error while parsing XLIFF file");
    else {
      project_setup();
    }
}

function get_segment_context(segment_id) {
  // Chris: why this complicated selector?
  return $('tr[id="cid-'+segment_id+'"]');
}

function save_language_preference(lang) {
  if ('localStorage' in window && window['localStorage'] !== null) {
    console.log("Saving language preference: " + lang);
    localStorage.setItem('target-lang', lang);
  }  
}

function get_language_perference() {
  var lang = "";
  lang = localStorage.getItem('target-lang');
  return lang;
}

function set_target_lang(task_target_lang) {
  if (task_target_lang == "German") {
    lang_path = "de/";
  }
  else if (task_target_lang == "Chinese") {
    lang_path = "zh/";
  }  
  else if (task_target_lang == "Japanese") {
    lang_path = "ja/";
  }    
  else
    lang_path = "es/";
}