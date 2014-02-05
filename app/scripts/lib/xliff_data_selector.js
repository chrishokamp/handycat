function _get_segid(segment) {
  return segment.getAttribute("mid");
}

function _get_tuid(segment) {
  // Chris - why do we need the id
  // id of transunit needed to be able to differenciate between altrans
  var transunit_node = segment.parentNode.parentNode;
  return transunit_node.getAttribute("id");
}

// Chris: here we assume that translatable segments are in <mrk></mrk> tags -- see xliff file specification
function get_translatable_segments(doc) {
  return doc.querySelectorAll('seg-source > mrk[mtype="seg"]');
}

function get_altrans(doc, segment) {
  var segid = _get_segid(segment);
  var tuid = _get_tuid(segment)
  return doc.querySelectorAll('trans-unit[id="'+tuid+'"] > alt-trans[mid="'+segid+'"] > target');
}

// Chris: this assumes that the translation units are in <mrk></mrk> tags - what if they aren't?
function get_mrk_target(doc, segment) {
  var segid = _get_segid(segment);
  var tuid = _get_tuid(segment);
  return doc.querySelector('trans-unit[id="'+tuid+'"] > target > mrk[mtype="seg"][mid="'+segid+'"]');
}

function get_target(doc, segment) {
  var segid = _get_segid(segment);
  var tuid = _get_tuid(segment);
  return doc.querySelector('trans-unit[id="'+tuid+'"] > target');
}

function get_transunit(doc, tuid) {
  return doc.querySelector('trans-unit[id="'+tuid+'"]');
}

function get_provenance_record(doc, ref) {
  var new_ref = ref.slice(1);
  var prov_record = doc.querySelector('[*|id="' + new_ref + '"]');
  return prov_record;
}