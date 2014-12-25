var ngTasker = angular.module('ngTasker',[])
	.controller('TaskController', ['$scope',function($scope){
		$scope.tasks = [
			{description:'Task 1', done:false, edit:false},
			{description:'Task 2', done:false, edit:false}
			];
		$scope.progress = 0;
		$scope.addTask = function(){
			$scope.tasks.push({description:$scope.newTask, done:false, edit:false});
			$scope.newTask='';
			$scope.calculateProgress();

		}//;//optional
		$scope.deleteTask = function(index){
			$scope.tasks.splice(index,1);
			console.log('deleting the index : '+index);
			$scope.calculateProgress();		
		}
		//
		$scope.doTask = function(index){
			if($scope.tasks[index].done == true){
				$scope.tasks[index].done = false;
			}else{
				$scope.tasks[index].done = true;
			}

			$scope.calculateProgress();
		}
		$scope.toggleEdit = function(index){
			if($scope.tasks[index].edit == false){//dry
				$scope.tasks[index].edit = true;
			}else{
				$scope.tasks[index].edit = false;
			}
		}
		$scope.calculateProgress = function(){

			count = 0;
			angular.forEach($scope.tasks,function(task){
				count += task.done ? 0 : 1;
			});
			total = $scope.tasks.length;
			remaining = total - count;
			$scope.progress = (remaining/total)*100;
			// console.log('count is '+count);
		}
		$scope.importTaskList = function($fileContent){
			// fileText = $fileContent.replace('\\','' );
			fileText = $fileContent.replace(/\\/ig,'' ); //regex

			var splittedText = fileText.split("},{", -1);
			console.log(splittedText);

			$scope.tasks = [];

			angular.forEach(splittedText,function(task,index){
				if(index == 0){
					task = task.replace(/"/i,'' ); 
					task = task+'}';
				}else if(index == splittedText.length-1){
					task = task.replace(/"$/i,'' ); 
					task = '{'+task;
				}else{
					task = '{'+task+'}';
				}
				// console.log(task);
				// console.log(JSON.parse(task));
				$scope.tasks.push(JSON.parse(task));
			});
		}
		$scope.showContent = function($fileContent){
	        $scope.content = $fileContent;
	        $scope.importTaskList($fileContent);
	    };
		$scope.saveAsFile = function(){
			var taskList;
			angular.forEach($scope.tasks,function(task,index){
				if(index == 0){
					taskList = JSON.stringify(task)+',';
				}else if(index == $scope.tasks.length-1){
					taskList = taskList + JSON.stringify(task);
				}else{
					taskList = taskList + JSON.stringify(task)+',';
				}
			});
			// console.log(taskList);
			// console.log(JSON.parse(taskList));

			var blob = new Blob([JSON.stringify(taskList)], {type: "text/plain;charset=utf-8"});
			saveAs(blob, "hello world.txt");
		}
		$scope.fileImportClick = function(){
			$('input[type=file]').click();
		}
	}]);

ngTasker.directive('onReadFile', function ($parse) {
	return {
		restrict: 'A',
		scope: false,
		link: function(scope, element, attrs) {
            var fn = $parse(attrs.onReadFile);
            
			element.on('change', function(onChangeEvent) {
				var reader = new FileReader();
                
				reader.onload = function(onLoadEvent) {
					scope.$apply(function() {
						fn(scope, {$fileContent:onLoadEvent.target.result});
					});
				};

				reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
			});
		}
	};
});
