Notes = new Meteor.Collection("notes");

if (Meteor.is_client) {
  Template.main.note_selected = function() {
    var note = Notes.findOne(Session.get("current_note"));
    return note && note.name;
  };
    
  Template.note.current_note = function() {
    return Notes.findOne(Session.get("current_note"));
  };
  
  Template.note.current_note_html = function() {
    var t = Notes.findOne(Session.get("current_note")).text;
    return t.replace(/\?(\w+)/g, "<span class='note_link' id='$1'>$1</span>");
  }
  
  Template.note.events = {
    'click input' : function () {
      var new_text = document.getElementById("note_textarea").value;
      var note = Notes.findOne(Session.get("current_note"));
      Notes.update(Session.get("current_note"), {$set: {text: new_text}});
    },
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
        Session.set("current_note", id);
      } else {
        Session.set("current_note", note._id);
      }
      
      // refresh textarea
      document.getElementById("note_textarea").value = note.text;
    }
  };  

  Template.notes.notes = function () {
    var notes = Notes.find();
    return notes;
  };

  Template.notes.root_note = function() {
    return (this.name === "root");
  }

  Template.notes.events = {
    'click span.delete_note_button': function(e) {
      var note_name = e.target.id;
      if (note_name !== "root") {
        Notes.remove(Notes.findOne({name: note_name})._id);
      }
    },
    'click span.note_details': function () {
      Session.set("current_note", this._id);
      var textarea = document.getElementById("note_textarea");
      if (textarea != null) {
        textarea.value = this.text;
      }
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