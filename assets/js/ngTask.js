angular.module('ngTasker',[])
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
			console.log('count is '+count);
		}
	}]);