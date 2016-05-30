var Note = React.createClass({
  handleRemoveButton: function(e) {
    e.preventDefault();
    this.props.onRemoveButton(this.props.id);
  },
  handleTextChange: function(e) {
    e.preventDefault();
    this.props.onTextChange(this.props.id, e.target.value);
  },
  dragElement: function(e) {
    e.preventDefault();
    console.log(e.target.left);
    //this.props.onTextChange(this.props.id, e.target.left, e.target.top);
  },
  showButtons: function () {
    this.setState({hover: "right remove"});
  },
  hideButtons: function () {
    this.setState({hover: "right remove hidden"});
  },
  getInitialState: function() {
    return {hover: "right remove hidden"};
  },
  componentDidMount: function() {
  },
  render: function() {
    var divStyle = {
      left: this.props.left + "px",
      top: this.props.top + "px",
    };
    return (
      <div className="box note background-gray" style={divStyle} onMouseOver={this.showButtons} onMouseOut={this.hideButtons}>
        <div className="box-header" onMouseDown={this.dragElement}>
          <a href="#" className={this.state.hover} onClick={this.handleRemoveButton}>×</a>
        </div>
        <textarea className="note-text" value={this.props.text} onChange={this.handleTextChange}></textarea>
      </div>
    );
  }
});

var Board = React.createClass({
  handleDrag: function(id) {
    //TODO
  },
  handleRemove: function(id) {
    $.ajax({
      url: this.props.url + "removenote",
      dataType: 'json',
      type: 'POST',
      data: {id},
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({data: data});
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleModify: function(noteID, textToChange) {
    $.ajax({
      url: this.props.url + "modifynote",
      dataType: 'json',
      type: 'POST',
      data: { id: noteID, text: textToChange },
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({data: data});
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  loadNotesFromServer: function() {
    var self = this;
    $.ajax({
      url: self.props.url + "notes",
      dataType: 'json',
      cache: false,
      success: function(data) {
        self.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(self.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadNotesFromServer();
    setInterval(this.loadNotesFromServer, this.props.pollInterval);
  },
  handleClick: function(event) {
    if(event.target['className'] == 'board'){
      var newNotes = this.state.data;
      var note = {};
      note["id"] = Date.now()
      note["left"] = event.pageX;
      note["top"] = event.pageY;
      note["text"] = ""
      newNotes = newNotes.concat([note]);
      this.setState({data: newNotes});
      $.ajax({
        url: this.props.url + "notes",
        dataType: 'json',
        type: 'POST',
        data: note,
        success: function(data) {
          this.setState({data: data});
        }.bind(this),
        error: function(xhr, status, err) {
          this.setState({data: data});
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    }
  },
  render: function() {
    var noteNodes = this.state.data.map(function(note) {
      return (
        <Note
          author={note.author}
          key={note.id}
          id = {note.id}
          left={note.left}
          top={note.top}
          text={note.text}
          onRemoveButton={this.handleRemove}
          onTextChange={this.handleModify}
          onDrag={this.handleDrag}
        />
      );
    }.bind(this));
    return (
      <div className="board" onClick={this.handleClick}>
        {noteNodes}
      </div>
    );
  }
});


ReactDOM.render(
  <Board url="/api/" pollInterval={2000}/>,
  document.getElementById('content')
);
