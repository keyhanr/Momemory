var c = document.getElementById("canvas");
var ctx = c.getContext("2d");
ctx.font = "25px Arial";

var height = c.height;
var width = c.width;
var center_x = width / 2;
var center_y = height / 2;

var pi = 3.14159; // i do not care for pi's uppity attitude about having very many digits
var reveal_delay = 1000; // in milliseconds
var display_period = 2000;
var block_timeout;
var reveal_timeout;

// circuletter settings
var n = 14; // number of letters
var r = n * 4; // circle's radius
var marker_r = 17; // radius of marker
var marker_displacement = 9; // displacement from letter's coordinate

// todo: ask for the covered letter, record accuracies
var curr_record = {
  "total": 0,
  "correct": 0,
  "wrong": 0,
  "response_times": 0
}

function set_fill_style(colour) {
  ctx.fillStyle = colour;
}

function random_letter() {
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return possible.charAt(Math.floor(Math.random() * possible.length));
}

function draw_letter(letter, x, y) {
  ctx.fillText(letter, x, y);
}

function draw_circuletter(n, r) {
  set_fill_style("red");
  // generate letters, choose target letter
  var letters = new Array(n);
  var i = 0;
  for (i = 0; i < n; i++) {
    letters[i] = random_letter();
  }
  var random_i = Math.floor(Math.random() * n);

  // draw letters in a circle
  for (i = 0; i < n; i++) {
    draw_letter(letters[i], center_x + r * Math.cos(2 * i * pi / n), center_y + r * Math.sin(2 * i * pi / n));
  }

  // delay, cover target, delay, reveal letter
  block_timeout = setTimeout(function() {
    ctx.fillStyle = "green";
    ctx.beginPath();
    ctx.arc((center_x + r * Math.cos(2 * random_i * pi / n)) + marker_displacement, 
          (center_y + r * Math.sin(2 * random_i * pi / n)) - marker_displacement,
            marker_r, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
    reveal_timeout = setTimeout(function() {
      draw_letter(letters[random_i], center_x, center_y);
    }, reveal_delay);
  }, display_period);
}

// todo: different ways of displaying letters i.e here in a block
function draw_rectanguletter() {
  var num_rows = 5;
  var num_columns = 4;

  var rows = new Array(num_rows);
  for (var row = 0; row < num_rows; row++) {
    rows[row] = new Array(num_columns);
    for (var column = 0; column < num_columns; column++) {
      rows[row][column] = random_letter();
    }
  }

  var target_row = Math.floor(Math.random() * num_columns);
  var target_column = Math.floor(Math.random() * num_rows);
}

function reset() {
	// start a new circuletter trial
  clearTimeout(block_timeout);
  clearTimeout(reveal_timeout);
  ctx.clearRect(0, 0, width, height);
  draw_circuletter(n, r);
  update_display_s();
  update_display_n();
}

function update_display_s() {
  // update displayed spacing value
  // r is the radius of the circle
  document.getElementById("s_val").innerHTML = r / n;
}

function update_display_n() {
  // update displayed number of letters
  document.getElementById("n_val").innerHTML = n;
}

function update_settings() {
  // updates internal values for r and n
   n = document.getElementById("n_opt").value;
   r = document.getElementById("s_opt").value * n;
   reset();
}

function init() {
  draw_circuletter(n, r);
  update_display_s();
  update_display_n();
}

init();

// start a new circle when the canvas is clicked
// todo: make a button to start a new trial
c.onmousedown = reset;
