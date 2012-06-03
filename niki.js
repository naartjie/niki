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
    return t.replace(/\?(\w+)/g, "<span class='note_link'>$1</span>");
  }
  
  function click_link(e) {
    // console.log(e);
    // console.log(this);
    console.log("onclick event fired");
    
    
  }
  
  Template.note.events = {
    'click input' : function () {
      var new_text = document.getElementById("note_textarea").value;
      var note = Notes.findOne(Session.get("current_note"));
      Notes.update(Session.get("current_note"), {$set: {text: new_text}});
    },
    'click a_not' : function() {
      console.log("clicked note link " + document.URL);
      
      // find note
      // todo
      var name = "root";
      var note = Notes.findOne({name: name});
      
      if (note == null) {
        // create a new note with name
        note = {
          name: name,
          text: ""
        };
        var id = Notes.insert(note);
        Session.set("current_note", id);
      } else {
        Session.set("current_note", note._id);
      }
      var textarea = document.getElementById("note_textarea");
      textarea.value = note.text;
    }
  };  

  Template.notes.notes = function () {
    var notes = Notes.find();
    return notes;
  };

  Template.notes.events = {
    'click': function () {
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