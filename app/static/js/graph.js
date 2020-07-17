
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
