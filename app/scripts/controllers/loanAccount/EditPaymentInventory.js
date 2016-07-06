(function (module) {
    mifosX.controllers = _.extend(module, {
        EditPaymentInventory: function (scope, resourceFactory, routeParams, location, dateFilter) {
        scope.loanId = routeParams.loanId;
        scope.paymentInventoryId = routeParams.paymentInventoryId;
        scope.formData = {};
        scope.pdcData = [];
        scope.date = {};
        scope.statusType = [{id: 1, code: "pdcPresentationStatus.notReceived", value: "Not Received"}, 
                      {id: 2, code: "pdcPresentationStatus.verifiedAndReceived", value: "Verified And Received"}];
       
        //scope.date.dueDate = new Date();

        //scope.pdcType = 'Full Pdc';

        resourceFactory.PaymentInventoryResource.getInventory({loanId: routeParams.loanId, inventoryId: routeParams.paymentInventoryId }, function(data){
          scope.pdcData = data.paymentInventoryPdc;

          for (var i in scope.pdcData){
            if(scope.pdcData[i].chequeDate != null)
              scope.pdcData[i].chequeDate = new Date(scope.pdcData[i].chequeDate);
          }

        });

  

        scope.submit = function () {
            //var date = dateFilter(scope.date.dueDate, scope.df);
            this.formData.locale = scope.optlang.code;
            this.formData.dateFormat = scope.df;
            if (scope.pdcData.length > 0){
                scope.formData.pdcData = [];
                //scope.formData.pdcData.push({isSeriesCheques: this.formData.isSeriesCheques,type:this.formData.pdcTypeId})
                for (var i in scope.pdcData) {
                      scope.formData.pdcData.push({ifscCode: scope.pdcData[i].ifscCode,
                       micrCode: scope.pdcData[i].micrCode, 
                       presentationStatus:1,makePresentation: false,  
                       period: scope.pdcData[i].period, chequeNo: scope.pdcData[i].chequeno, 
                       amount: scope.pdcData[i].amount, chequeDate: dateFilter(scope.pdcData[i].chequeDate, scope.df), 
                       nameOfBank:scope.pdcData[i].nameOfBank, branchName: scope.pdcData[i].branchName,
                       presentationStatus: scope.pdcData[i].presentationStatus.id });
                    console.log(scope.formData.pdcData);
                }


            }

            resourceFactory.PaymentInventoryResource.putInventory( {loanId: scope.loanId, inventoryId: scope.paymentInventoryId }, this.formData, function (data) {
                location.path('/viewloanaccount/' + data.loanId );
            });
        };

        }
    });
    mifosX.ng.application.controller('EditPaymentInventory', ['$scope', 'ResourceFactory', '$routeParams', '$location','dateFilter', mifosX.controllers.EditPaymentInventory]).run(function ($log) {
        $log.info("EditPaymentInventory initialized");
    });
}(mifosX.controllers || {}));
