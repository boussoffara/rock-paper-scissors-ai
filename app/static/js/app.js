var rounds = 0;
var wins = 0;
var losses = 0;
var draws = 0;
var p1 = 0;
var p2 = 0;
var him = "r";
var history = new Array();
var alg = [nash, dt, send_server, markov];
var current_alg = 0;
history[0] = ["r", "r"];
var jqxhr = $.getJSON("/static/data/model.json");

function argMax(array) {
  return array.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
}

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function addvector(a, b) {
  return a.map((e, i) => e + b[i]);
}

function update_text() {
  rounds = rounds + 1;
  $("#wins").text("wins " + wins);
  $("#draws").text("draws " + draws);
  $("#losses").text("losses " + losses);
  $("#rounds").text("Round " + rounds);

}

function update_bar(wins, draws, losses) {
  return [100 * wins / (wins + losses), 100 * losses / (wins + losses)]
}

function update_ui(me, him) {
  [wins, draws, losses] = addvector([wins, draws, losses], play(me, him));
  [p1, p2] = update_bar(wins, draws, losses);
  gsap.to("#mys", {
    duration: .5,
    ease: "expo.out",
    width: p1 + "%"
  });
  gsap.to("#his", {
    duration: .5,
    ease: "expo.out",
    width: p2 + "%"
  });
  var t = new TimelineLite({
    paused: true
  });
  t.set($("#myhand"), {
    attr: {
      src: '/static/media/none.png'
    }
  }, 0);
  t.set($("#myhand"), {
    attr: {
      src: "/static/media/" + me + ".png"
    }
  }, 5);
  t.set($("#hishand"), {
    attr: {
      src: '/static/media/none.png'
    }
  }, 0);
  t.set($("#hishand"), {
    attr: {
      src: "/static/media/" + him + ".png"
    }
  }, 5);
  TweenLite.to(t, 0.2, {
    progress: 1,
    ease: Power4.easeInOut
  });
  update_text();
  history[rounds] = [me, him];
  update_history()


}

function update_history() {

  disp_hist = $("#histcont");
  ic = {
    1: "far fa-laugh-wink win",
    0: "far fa-meh draw",
    2: "far fa-sad-tear loss"
  };



  icons = {
    'r': rock_icons_btn,
    'p': paper_icons_btn,
    's': scissors_icons_btn
  };
  code1 = `<div class="row"><div class="col">
      <div class="rock-paper-scissors_disp">`;
  code2 = `</div></div><div class=col><i class="`
  code3 = ` vertical-center" ></i></div><div class=col><div class="rock-paper-scissors_disp flip">`;
  code4 = `</div></div></div>`;
  generated = ``;
  var i = 0;
  for (i = rounds; i > 0 && i > rounds - 5; i--) {
    g = play(history[i][0], history[i][1])
    generated += code1 + icons[history[i][0]] + code2 + ic[g[0] + 2 * g[2]] + code3 + icons[history[i][1]] + code4;
  }
  disp_hist.html(generated);

}


function play(me, him) {
  switch (true) {
    case (me === "r" && him === "s"):
      return [1, 0, 0]
      break;
    case (me === "r" && him === "r"):
      return [0, 1, 0]
      break;
    case (me === "r" && him === "p"):
      return [0, 0, 1]
      break;
    case (me === "s" && him === "p"):
      return [1, 0, 0]
      break;
    case (me === "s" && him === "s"):
      return [0, 1, 0]
      break;
    case (me === "s" && him === "r"):
      return [0, 0, 1]
    case (me === "p" && him === "r"):
      return [1, 0, 0]
      break;
    case (me === "p" && him === "p"):
      return [0, 1, 0]
      break;
    case (me === "p" && him === "s"):
      return [0, 0, 1]
      break;
    default:
  }
}

function play_next(p) {
  switch (p) {
    case ("r"):
      return "p";
      break;
    case ("p"):
      return "s";
      break;
    case ("s"):
      return "r";
      break;
  }
}

function play_him(p) {
  return p
}

function play_prev(p) {
  switch (p) {
    case ("r"):
      return "s";
      break;
    case ("p"):
      return "r";
      break;
    case ("s"):
      return "p";
      break;
  }
}

function nash(me) {
  him = randomChoice(['p', 'r', 's']);
  update_ui(me, him);
}

function dt(me) {

  previous = history[rounds];
  previous_results = play(previous[0], previous[1]);
  previous_me = previous[0];
  if (previous_results[0] == 1) {
    him = play_next(previous_me);
  } else if (previous_results[2] == 1) {
    him = play_him(previous[1]);
  } else {
    him = play_next(previous_me);
  }
  update_ui(me, him);

}

function markov(me) {

  var init = jqxhr.responseJSON.distributions[0].parameters[0];
  if (rounds == 0) {
    var plays = ['p', 'r', 's'];
    him = plays[argMax([init["PR"] - init["PS"], init["RS"] - init["RP"], init["SP"] - init["SR"]])];

  } else {
    var expected = {
      "R": 0,
      "P": 0,
      "S": 0
    };
    current_state = history[rounds][0].toUpperCase() + history[rounds][1].toUpperCase();
    var i = 0;
    for (i = 0; i < 81; i++) {
      if (jqxhr.responseJSON.distributions[1].table[i][0] == current_state) {


        next_state = jqxhr.responseJSON.distributions[1].table[i][1].toLowerCase();
        outcome = play(next_state[0], next_state[1]);
        if (outcome[0] == 1) {
          expected[next_state[0].toUpperCase()] -= parseFloat(jqxhr.responseJSON.distributions[1].table[i][2]);
        } else if (outcome[2] == 1) {
          expected[next_state[0].toUpperCase()] += parseFloat(jqxhr.responseJSON.distributions[1].table[i][2]);
        }



      }
    }
    console.log(expected);
    him = Object.keys(expected).reduce((a, b) => expected[a] > expected[b] ? a : b).toLowerCase();

  }
  update_ui(me, him);
}

function send_server(me) {
  var req = $.ajax({
    url: '/play',
    type: 'POST',
    data: {
      me: me
    }
  });
  req.done(function(data) {
    update_ui(me, data["him"]);
  });

}

function set_alg(id) {
  $("#0").removeClass('active');
  $("#1").removeClass('active');
  $("#2").removeClass('active');
  $("#3").removeClass('active');
  $("#" + id).addClass('active');
  current_alg = id;

}



$("#button-paper").click(function() {
  alg[current_alg]("p");
});
$("#button-rock").click(function() {
  alg[current_alg]("r");
});
$("#button-scissors").click(function() {
  alg[current_alg]("s");
});

document.onkeydown = checkKey;

function checkKey(e) {

  e = e || window.event;

  if (e.keyCode == '40') {
    alg[current_alg]("p");

  } else if (e.keyCode == '37') {
    alg[current_alg]("r");
  } else if (e.keyCode == '39') {
    alg[current_alg]("s");
  }
}
plot_dt();
