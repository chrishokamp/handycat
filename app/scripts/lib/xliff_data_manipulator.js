// Chris: use this script to modify an xliff
// PROVENANCE TOOL INFO
var revTool = "escriba-MOBILE-WEB-CAT";
var revOrgRef = "http://mobile-webcat.appspot.com";
var revPerson = "Default-user";
var provRef = "Default-ref";
var provID = "#defaultprov";

// ## TARGETS ## //
function create_new_mrk_target(doc, segment, target_value, target_lang) {
  var segid = _get_segid(segment);
  var tuid = _get_tuid(segment);

  // create new mrk/target node
  var mrk_target = doc.createElement('mrk');
  mrk_target.setAttribute('mid', segid);
  mrk_target.setAttribute('mtype', 'seg');
  mrk_target.textContent = target_value;

  var target_node = get_target(doc, segment);
  if (!target_node) {
    // There is no previous translations for this transunit
    // create new target node
    target_node = doc.createElement('target');
    target_node.setAttribute('xml:lang', target_lang);

    // append to specific transunit node
    var trans_uni = get_transunit(doc, tuid);
    trans_uni.appendChild(target_node);
  }
  
  // append to specific target node
  target_node.appendChild(mrk_target);

  return mrk_target;
}

function remove_mrk_target(doc, segment)  {
  var target_node = get_target(doc, segment);
  var mrk_target_to_be_removed = get_mrk_target(doc, segment);

  if (target_node && mrk_target_to_be_removed) {
    target_node.removeChild(mrk_target_to_be_removed);
    // remove target if empty
    if (target_node.childElementCount == 0)
      target_node.parentNode.removeChild(target_node);
  }
}

// ## PROVENANCE ## //

function insert_new_child_record(doc, prov_record) {
  var new_prov_record = doc.createElement(ITS_PROV_RECORD_CHILD);
  new_prov_record.setAttribute(ITS_PROV_SO_REV_TOOL, revTool);
  new_prov_record.setAttribute(ITS_PROV_SO_REV_ORG_REF, revOrgRef);
  
  var theRevPerson = "";
  if (user_nickname)
    theRevPerson = user_nickname;
  else
    theRevPerson = revPerson;
  new_prov_record.setAttribute(ITS_PROV_SO_REV_PERSON, theRevPerson);
  new_prov_record.setAttribute(ITS_PROV_SO_REF, provRef);
  // insert new child record (convention: newest records first)
  prov_record.insertBefore(new_prov_record, prov_record.firstChild);
}

var xml_namespace = "http://www.w3.org/XML/1998/namespace";
function create_new_prov_record(doc) {
  var prov_record = get_provenance_record(doc, provID);
  if (!prov_record) {
    // create new provenance record
    prov_record = doc.createElement(ITS_PROV_RECORD);
    prov_record.setAttributeNS(xml_namespace, "xml:id", provID.slice(1))
    //prov_record.setAttribute("xml:id", provID.slice(1));
    $('header', doc).prepend(prov_record);
    insert_new_child_record(doc, prov_record);
  }

  // returning new prov record's id
  return provID;
}

function add_provenance_crossref(node, prov_ref) {
  node.setAttribute(ITS_PROV_RECORD_REF, prov_ref);
}

function remove_provenance_crossref(node) {
  node.removeAttribute(ITS_PROV_RECORD_REF);
}

function remove_inline_provenance(node) {
  node.removeAttribute(ITS_PROV_RECORD_REF);
  node.removeAttribute(ITS_PROV_PERSON);
  node.removeAttribute(ITS_PROV_PERSON_REF);
  node.removeAttribute(ITS_PROV_ORG);
  node.removeAttribute(ITS_PROV_ORG_REF);
  node.removeAttribute(ITS_PROV_TOOL);
  node.removeAttribute(ITS_PROV_TOOL_REF);
  node.removeAttribute(ITS_PROV_REV_PERSON);
  node.removeAttribute(ITS_PROV_REV_PERSON_REF);
  node.removeAttribute(ITS_PROV_REV_ORG)  
  node.removeAttribute(ITS_PROV_REV_ORG_REF);
  node.removeAttribute(ITS_PROV_REV_TOOL);
  node.removeAttribute(ITS_PROV_REV_TOOL_REF);
  node.removeAttribute(ITS_PROV_REF)  
}

function get_provenance_crossref(node) {
  return node.getAttribute(ITS_PROV_RECORD_REF);
}

function update_prov_record(ref) {
  var prov_record = get_provenance_record(xliff_doc, ref);
  if (!exist_provenance_record_child(prov_record, revTool))
    insert_new_child_record(xliff_doc, prov_record);
}

function its_insert_mtconfidence(node, mtconfidence) {
  node.setAttribute(ITS_MT_CONFIDENCE, mtconfidence);
}

function exist_provenance_record_child(prov_record, rev_tool) {
  if (prov_record) {
    var children = prov_record.childNodes;
    for (var i=0; i<children.length; i++) {
      if (children[i].tagName == ITS_PROV_RECORD_CHILD) {
        if (children[i].getAttribute(ITS_PROV_SO_REV_TOOL) == rev_tool)
          return true;
      }
    }
  }
  return false;
}