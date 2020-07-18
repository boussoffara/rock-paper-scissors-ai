
function plot_dt(){
        var graph = new joint.dia.Graph;
        var holder= $("#myholder");

        var paper = new joint.dia.Paper({
            el: holder,
            model: graph,
            width: holder.width(),
            height: 300,
            gridSize: 1
        });

        var rect = new joint.shapes.standard.Rectangle();
        rect.position(holder.width()/3, 100);
        rect.resize(100, 40);
        rect.attr({
            body: {
                fill: 'white',
                rx: 2,
                ry: 2,
                strokeWidth: 1,
            },
            label: {
                text: 'Play',
                fill: '#312f2f'
            }
        });
        rect.addTo(graph);

        var rect2 = rect.clone();
        rect2.translate(150, -50);
        rect2.attr('label/text', 'Won');
        rect2.addTo(graph);

        var rect3 = rect.clone();
        rect3.translate(150, 0);
        rect3.attr('label/text', 'Draw');
        rect3.addTo(graph);

        var rect4 = rect.clone();
        rect4.translate(150, 50);
        rect4.attr('label/text', 'Lost');
        rect4.addTo(graph);

        var rect5 = rect.clone();
        rect5.translate(300, -25);
        rect5.attr('label/text', 'Play same');
        rect5.addTo(graph);

        var rect6 = rect.clone();
        rect6.translate(300, +25);
        rect6.attr('label/text', 'Play next');
        rect6.addTo(graph);

        var link1 = new joint.shapes.standard.Link();
        link1.source(rect);
        link1.target(rect2);
        link1.addTo(graph);

        var link2 = new joint.shapes.standard.Link();
        link2.source(rect);
        link2.target(rect3);
        link2.addTo(graph);

        var link3 = new joint.shapes.standard.Link();
        link3.source(rect);
        link3.target(rect4);
        link3.addTo(graph);

        var link5 = new joint.shapes.standard.Link();
        link5.source(rect2);
        link5.target(rect5);
        link5.addTo(graph);

        var link4 = new joint.shapes.standard.Link();
        link4.source(rect3);
        link4.target(rect6);
        link4.addTo(graph);

        var link6 = new joint.shapes.standard.Link();
        link6.source(rect4);
        link6.target(rect6);
        link6.addTo(graph);
}


function plot_markov(){
        possible_states= ["RS","RP","RR","SP","SR","SS","PS","PR","PP"];
        var graph = new joint.dia.Graph;
        var holder= $("#myholder");

        var paper = new joint.dia.Paper({
            el: holder,
            model: graph,
            width: holder.width(),
            height: 300,
            gridSize: 1
        });

        var rect = new joint.shapes.standard.Rectangle();
        rect.position(holder.width()/18, 100);
        rect.resize(60, 40);
        rect.attr({
            body: {
                fill: 'white',
                rx: 2,
                ry: 2,
                strokeWidth: 1,
            },
            label: {
                text: possible_states[0],
                fill: '#312f2f'
            }
        });
        rect.addTo(graph);


        var input_states=[];
        input_states.push(rect);
        var i=1;
        for (i = 1; i<9; i++) {
          input_states.push(rect.clone());
          input_states[i].translate(i*1.85*holder.width()/18, 0);
          input_states[i].attr('label/text', possible_states[i]);
          input_states[i].addTo(graph);
      }

      var output_states=[];
      var i=1;
      for (i = 0; i<3; i++) {
        output_states.push(rect.clone());
        if (i %2==0){
          output_states[i].translate((i+1)*3.5*holder.width()/18,150);
        }else{
          output_states[i].translate((i+1)*3.5*holder.width()/18,-100);
        }

        output_states[i].attr('label/text', possible_states[i]);
        output_states[i].addTo(graph);
    }
    var links=[];







    var j=0;
    var i=0;
    for (i = 0; i<9; i++) {
      for (j = 0; j<3; j++) {
      var link6 = new joint.shapes.standard.Link();
      link6.attr(    {
        line: {
            connection: true,
            stroke: '#333333',
            strokeWidth: 2,
            strokeLinejoin: 'round',
            targetMarker: {
                'type': 'path',
                'd': 'M 10 -5 0 0 10 5 z'
            }
        }})
      link6.source(input_states[i]);
      link6.target(output_states[j]);
      link6.addTo(graph);
      links.push(link6);
  }}




}
