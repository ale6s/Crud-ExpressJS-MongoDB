var squareCount = 16;
var emptySquare;

$(document).ready(() => {
    $.event.props.push("dataTransfer");
    createBoard();
    addTiles();
});

function createBoard() {
    for (var i = 0; i < squareCount; i++) {
        var $square = $(
            '<div id="square' + i + '" data-square="' + i + '" class="square"></div>'
        );
        $square.appendTo($("#gameBoard"));
    }
}

function addTiles() {
    emptySquare = squareCount - 1;
    for (var i = 0; i < emptySquare; i++) {
        var $square = $("#square" + i);
        var $tile = $(
            '<div draggable="true" id="tile' +
            i +
            '" class="tile">' +
            (i + 1) +
            "</div>"
        );
        $tile.appendTo($square);
    }
}

$(document).ready(() => {
    $.event.props.push("dataTransfer");
    $("#gameBoard").on("dragstart", dragStarted);
    $("#gameBoard").on("dragend", dragEnded);
    $("#gameBoard").on("dragenter", preventDefault);
    $("#gameBoard").on("dragover", preventDefault);
    $("#gameBoard").on("drop", drop);
    scramble();
});

function dragStarted(e) {
    var $tile = $(e.target);
    $tile.addClass("dragged");
    var sourceLocation = $tile.parent().data("square");
    e.dataTransfer.setData("text", sourceLocation.toString());
    e.dataTransfer.effectAllowed = "move";
}

function dragEnded(e) {
    $(e.target).removeClass("dragged");
}

function preventDefault(e) {
    e.preventDefault();
}

function drop(e) {
    var $square = $(e.target);
    if ($square.hasClass("square")) {
        var destinationLocation = $square.data("square");
        if (emptySquare != destinationLocation) return;
        var sourceLocation = Number(e.dataTransfer.getData("text"));
        moveTile(sourceLocation);
    }
}

function moveTile(sourceLocation) {
    var distance = sourceLocation - emptySquare;
    if (distance < 0) distance = -distance;
    if (distance == 1 || distance == 4) {
        swapTileAndEmptySquare(sourceLocation);
    }
}
function swapTileAndEmptySquare(sourceLocation) {
    var $draggedItem = $("#square" + sourceLocation).children();
    $draggedItem.detach();
    var $target = $("#square" + emptySquare);
    $draggedItem.appendTo($target);
    emptySquare = sourceLocation;
}

function scramble() {
    for (var i = 0; i < 128; i++) {
        var random = Math.random();
        var sourceLocation;
        if (random < 0.5) {
            var column = emptySquare % 4;
            if (column == 0 || (random < 0.25 && column != 3)) {
                sourceLocation = emptySquare + 1;
            } else {
                sourceLocation = emptySquare - 1;
            }
        } else {
            var row = Math.floor(emptySquare / 4);
            if (row == 0 || (random < 0.75 && row != 3)) {
                sourceLocation = emptySquare + 4;
            } else {
                sourceLocation = emptySquare - 4;
            }
        }
        swapTileAndEmptySquare(sourceLocation);
    }
}

function drop(e) {
    var $square = $(e.target);
    if ($square.hasClass("square")) {
        var destinationLocation = $square.data("square");
        if (emptySquare != destinationLocation) return;
        var sourceLocation = Number(e.dataTransfer.getData("text"));
        moveTile(sourceLocation);
        checkForWinner();
    }
}

function checkForWinner() {
    if (emptySquare != squareCount - 1) return;
    for (var i = 0; i < emptySquare; i++) {
        if (
            $("#tile" + i)
                .parent()
                .attr("id") !=
            "square" + i
        )
            return;
    }
    $("#message").html("Winner!");
}

/*ajax code goes herw*/ 
var milliseconds = 1000;
var opacity = 0.5;

function displayCoverAsync() {
  return $("#cover")
    .fadeTo(milliseconds, opacity)
    .promise();
}
function showMessageContentAsync(message) {
  $("#message").html(message);
  $("#messageBox").show();
  return $("#messageContent")
    .slideDown(milliseconds)
    .promise();
}

function showMessageAsync(message) {
  var coverPromise = displayCoverAsync();
  var messagePromise = coverPromise.pipe(function() {
    return showMessageContentAsync(message);
  });
  return messagePromise;
}

function displayTimeAsync() {
  var message = "The time is now " + getTime();
  return showMessageAsync(message);
}

function getTime() {
  var dateTime = new Date();
  var hours = dateTime.getHours();
  var minutes = dateTime.getMinutes();
  return hours + ":" + (minutes < 10 ? "0" + minutes : minutes);
}

$(document).ready(function() {
  $("#btnShowMessage").click(displayTimeAsync);
});
function hideMessageContentAsync(message) {
  var promise = $("#messageContent")
    .slideUp(milliseconds)
    .promise();
  promise.done(function() {
    $("#messageBox").hide();
  });
  return promise;
}

function hideCoverAsync() {
  return $("#cover")
    .fadeOut(milliseconds)
    .promise();
}

function hideMessageAsync() {
  var messagePromise = hideMessageContentAsync();
  var coverPromise = messagePromise.pipe(function() {
    return hideCoverAsync();
  });
  return coverPromise;
}

$(document).ready(function() {
  $("#btnShowMessage").click(displayTimeAsync);
  $("#messageOk").click(hideMessageAsync);
});
