module.exports = (function(){

	var Toolbar = require('./Toolbar.js');
	var Shape = require('./Shape.js');
	var Line = require('./Line.js');

	var shapes = [];
	var lines = [];
	var tempArray = [];
	var creatingLine = false;
	var point = [];

	paper.install(window);
	paper.setup('cnvs');

	
	function FlowchartApplication($el) {
		var tool = new Tool();
		this.selected = 0;
		console.log('Making app....');

		this.$el = $el;
		this.tool = 'shape';
		this.toolbar = new Toolbar($el);

		var shape;
		this.$el.click(this.clickHandler.bind(this));
		tool.onMouseDown = this.clickHandler.bind(this);

		$('.save-flowchart').click(this.save);
		if(getParameterByName('id') != ''){
			$.get('index.php?page=loadFlowchart&id='+getParameterByName('id'),function(data){
				this.createFlowchart(data);
			}.bind(this));	
		}

		//bean.on(this.deleteButton, 'click', this.removeHandler.bind(this));
		bean.on(this.toolbar,'changeTool',this.changeTool.bind(this));
		
		

	}
	FlowchartApplication.prototype.changeSelected = function(obj){
		//change tool
		console.log('selecting');
		this.selected = obj;
		console.log(this.selected);
		//this.tool = tool;
	};
	FlowchartApplication.prototype.changeTool = function(tool){
		//change tool
		console.log('tool tool tool');
		this.tool = tool.tool.toLowerCase();
		console.log(this.tool);
		//this.tool = tool;
	};
	FlowchartApplication.prototype.createFlowchart = function(data){
		console.log(data);
		var shapes = data.shapes;
		for(var i = 0; i < shapes.length;i++){
			var shape = new Shape();
			shape.create(shapes[i].x,shapes[i].y,shapes[i].width,shapes[i].height,shapes[i].color,shapes[i].type,shapes[i].content);
			//shapes.push(shape);
		}
		var lines = data.lines;
		var tool = new ToolEvent;
		tool.point = [0,0];
		for(var i = 0; i < lines.length;i++){

			var line = new Line();
			line.create(lines[i].x1,lines[i].y1,lines[i].x2,lines[i].y2,lines[i].color);
			//lines.push(line);
			line.$c1.onMouseDrag = line.moveHandler.bind(line);
			line.$c2.onMouseDrag = line.moveHandler.bind(line);
		}
		


	}
	FlowchartApplication.prototype.selectHandler = function(obj){
		if(this.selected != 0){
			var currSelected = this.selected;
			currSelected.removeSelected();
		}
		this.selected = obj;
		obj.makeSelected();
	}
	FlowchartApplication.prototype.clickHandler = function(e){
		//console.log(this);
		switch(this.tool){
			case 'select':
			break;
			case 'shape':
				console.log('click');
				var shape = new Shape(e); 
				shapes.push(shape);
				this.selectHandler(shape);
				bean.on(shape,'changeSelected',this.changeSelected.bind(this));
			break;
			case 'line':
				if(project.hitTest(e.point) == null){	
					//create lines with canvas
					if(!creatingLine){
						console.log('first create Line');
						//point = [e.offsetX,e.offsetY]
						var line = new Line(e);
						lines.push(line);
						line.$c1.onMouseDrag = line.moveHandler.bind(line);

					}else{
						console.log('second create Line');
						var line = lines[lines.length-1];
						line.addCircle(e);
						line.$c2.onMouseDrag = line.moveHandler.bind(line);
						this.selectHandler(line);
						bean.on(shape,'changeSelected',this.changeSelected.bind(this));
					}
					console.log(lines);
					creatingLine = !creatingLine;
				}
			break;
			case 'file':
			break;
			case 'delete':
			break;
		}
		/*if(this.tool === 'shape'){
			console.log('click');
			var shape = new Shape(e); 
			shapes.push(shape);

		}else{
			if(project.hitTest(e.point) == null){	
				//create lines with canvas
				if(!creatingLine){
					console.log('first create Line');
					//point = [e.offsetX,e.offsetY]
					var line = new Line(e);
					lines.push(line);
					line.$c1.onMouseDrag = line.moveHandler.bind(line);

				}else{
					console.log('second create Line');
					var line = lines[lines.length-1];
					line.addCircle(e);
					line.$c2.onMouseDrag = line.moveHandler.bind(line);
				}
				console.log(lines);
				creatingLine = !creatingLine;
			}
		}*/
		
		//make Shape or Line, depending on this.tool
		//while get x,y coordinates from release click
	};
	
	FlowchartApplication.prototype.save = function(event){
		event.preventDefault();
		//data doorsturen via eigen post
		//eigen var aanmaken, object dus {}
		var $shapes2 = [];
		$(shapes).each(function(id,shape){
			$shapes2.push(
				{
					'x':shape.input.parentNode.style.left,
					'y':shape.input.parentNode.style.top,
					'width':shape.input.parentNode.style.width,
					'height':shape.input.parentNode.style.height,
					'type':'text',
					'content':shape.input.value

				});
		});
		
		var $lines2 = [];
		$(lines).each(function(id,line){
			$lines2.push(
				{
					'x1':line.x1,
					'y1':line.y1,
					'x2':line.x2,
					'y2':line.y2,
				});
		});
		
		var dataFlowchart = {
			'name': $("#viewerchanger").val(),
			'shapes': $shapes2,
			'lines': $lines2
		};
		//TODO: error handling met .error: meegeven aan user dmv evt window alert?
		$.post('index.php?page=saveFlowchart',dataFlowchart)
		.success(function(data){
			console.log('posted');
		});
		
		console.log('Save it yo');
	};
	
	function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}
	return FlowchartApplication;
})();