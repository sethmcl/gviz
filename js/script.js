var gogoGlobalFunction = function(data){ 
  var paper = Raphael(0, 0, "100%", "100%"),
  config = {
    gridX: 200,
    gridY: 200,
    commitWidth: 150,
    commitHeight: 50,
    commitRadius: 5,
    commitBasicAttr: {fill: "hsb(0, 1, 1)", stroke: "none", opacity: .5},
    commitDragAttr: {fill: "hsb(0, 1, 1)", stroke: "none", opacity: .25},
    commitOverAttr: {fill: "hsb(0, 1, 1)", stroke: "none", opacity: .5},
  },
  calloutContainer = document.getElementById('callout-container');
  Commit = (function (){
    /*
     * example commit cache
     * commits= 
     *  {
     *    hashKey: {node: Node, edges: [e1, e2], branch: branchName, parentNodes = [hash1, hash2], index: [0,0]}
     *  }
     *  example edge
     *  edges =
     *  {
     *    e1: {parentNode: p, childNode : c, edge: e1}
     *    
     *  }
     */
    var commitCache = {}, 
        branchIndex = [], /* branch names as lookup*/
        commitsOnBranchCounter = {};  /*numberOf Commits using key of branchName*/
    function cleanBranchName(dirtyName){
      var cleanName = '', temp;
        if (dirtyName === ''){
          cleanName = 'master';
        }else{ 
          temp = dirtyName.split(",");
          temp = temp[temp.length - 1].replace(/^ */,'').replace(/\)$/,'');
          cleanName = temp;
        }
      return cleanName;
    }
    function doBranchData(cleanName){
      var i = branchIndex.indexOf(cleanName);
      // update data if we haven't already seen it
      if (i === -1){
        //increment the counter
        branchIndex.push(cleanName);
        commitsOnBranchCounter[cleanName] = 0;
      }
    }
    function _putInCache(hash, commitData, overwrite){
      var cacheEntry={},
          node, 
          edges, 
          branchName, 
          parentNodes,
          indexPosition = {X:0, Y:0},
          i,len;
      // leave what in there unless we expclitly want to overwrite it
      if (commitCache[hash] && overwrite !== true){
        return commitCache[hash]
      }
      // slower slightly if you don't give me the data
      if (typeof commitData === 'undefined'){
        commitData = data[hash];
      }
      //cacheEntry.parentNodes

      //cacheEntry.branch
      branchName = cleanBranchName(commitData.branch);
      doBranchData(branchName);
      cacheEntry.branch = branchName;
      
      //cacheEntry.node
      indexPosition.Y = branchIndex.indexOf(branchName);
      indexPosition.X = commitsOnBranchCounter[branchName];
      //make a new Node
      cacheEntry.node = new Node(config.gridX * indexPosition.X, config.gridY * indexPosition.Y, 'commit', commitData);
      //increment the counter on this branch
      commitsOnBranchCounter[branchName] += 1;
      
      //cacheEntry.edges
      
      return commitCache[hash] = cacheEntry;

    }
    function addEdges(){
      //for p in c.p
      //  drawEdge (p,c)
    }
    function drawEdge(p, c){
      if (!p){
        return;
      }
      if (p.branch === c.branch){
        drawStraightLine(p, c);
      }else{
        drawStraightLine(getGridPt(p,c), c);
        drawStraightLine(p, getGridPt(p,c));
      }
    }
    function getGridPt(p,c){
      return p.getX, c.getY;
    }
    function drawStraightLine(p,c){
      //draw from p.getX,p.getY to c.getX, c.getY
    }
    this.getFromCache = function (hash){
      if (hash in commitCache){
        return commitCache[hash]
      }else{
        return _putInCache(hash);
      }
    }
    this.populateCache = function(commits){
      for (var hash in commits){
        _putInCache(hash, commits[hash]);
      }
    }
    return this;
  })(),


  Node = function (x, y, dataKey, dataVal){
    var p; 
    function onNodeStartDrag(){
      this.ox = this.attr('x');
      this.oy = this.attr('y');
      this.animate(config.commitDragAttr, 500, '>');
    }
    function onNodeEndDrag(){
      this.animate(config.commitBasicAttr, 500, '>');
    }
    function onNodeMove(dx, dy){
      this.attr({x: this.ox+dx, y: this.oy + dy});
    }
    function onNodeOver(){
    };
    p = paper.rect(x, y, config.commitWidth, config.commitHeight, config.commitRadius).attr(config.commitBasicAttr);
    p.drag(onNodeMove, onNodeStartDrag, onNodeEndDrag).data(dataKey, dataVal).mouseover(function(){
      var commitTitle, commitDate, nodeData = this.data(dataKey);
      commitTitle = document.querySelector('.title', calloutContainer);
      commitDate = document.querySelector('.date', calloutContainer);
      commitTitle.innerHTML = nodeData.author + ' added \'' + nodeData.message+'\'';
      commitDate.innerHTML = prettyDate ? prettyDate(nodeData.date): nodeData.date;
      calloutContainer.style.display = 'block';

    });
  },

  GitViz = function(commitData, onfig){
    function addCommits(commitData){
      Commit.populateCache(commitData)
    }
    /*
     * setup - make it look a nice 
     */
    function setup(){
      // loop and add commits
      addCommits(commitData);
    };
    setup();
  };


  new GitViz(data, config);
}
