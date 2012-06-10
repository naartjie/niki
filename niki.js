Notes = new Meteor.Collection("notes");

if (Meteor.is_client) {
  Template.main.note_selected = function() {
    var note = current_note();
    return note && note.name;
  };
    
  Template.note.current_note = function() {
    return current_note();
  };
  
  Template.note.current_note_html = function() {
    
    return "static text here";
    
    // var text = Notes.findOne(Session.get("current_note")).text;
    // return text_to_html(text);
  };
  
  function current_note() {
    return Notes.findOne(Session.get("current_note"));
  }

  function set_current_note(id) {
    Session.set("current_note", id);
    var text = current_note().text;
    
    console.log("setting div html to: " + text_to_html(text));
    document.getElementById("note_text").innerHTML = text_to_html(text);
  }  
  
  function save_note_text() {
    var new_text = html_to_text(document.getElementById("note_text").innerHTML);
    var note = current_note();
      
    console.log("saving: \n" + new_text);
    Notes.update(note, {$set: {text: new_text}});
  };

  function text_to_html(text) {
    // todo: convert newlines
    return text.replace(/\?(\w+)/g, "<span class='note_link' id='$1'>$1</span>");
  }

  function html_to_text(html) {
    var text = html
        .replace(/<br>/g, "\n")
        .replace(/<div>/g, "\n")
        .replace(/<\/div>/g, "")
        .replace(/<span \w+=\"\w+\" \w+=\"\w+\">(\w+)<\/span>/g, "?$1")
        .replace(/&nbsp;/g, " ")
        .trim();
      
    return text;
  };
  
  Template.note.events = {
    'click span.note_link' : function(e) {
      var note_name = e.target.id;
      var note = Notes.findOne({name: note_name});
      
      if (note == null) {
        // create a new note with name
        note = {
          name: note_name,
          text: ""
        };
        var id = Notes.insert(note);
        set_current_note(id);
      } else {
        set_current_note(note._id);
      }
    }
  };  

  Template.notes.notes = function () {
    var notes = Notes.find();
    return notes;
  };

  Template.notes.root_note = function() {
    return (this.name === "root");
  };

  Template.notes.events = {
    'click span.delete_note_button': function(e) {
      var note_name = e.target.id;
      if (note_name !== "root") {
        Notes.remove(Notes.findOne({name: note_name})._id);
      }
    },
    'click span.note_details': function () {
      set_current_note(this._id);
    }
  };
}

if (Meteor.is_server) {
  Meteor.startup(function () {
    if (Notes.find().count() === 0) {
      // create a root note
      Notes.insert({name: "root", text: "Start editing...."});
    }
  });
}