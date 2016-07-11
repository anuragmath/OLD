(function (module) {
    mifosX.controllers = _.extend(module, {
        AddPaymentInventory: function (scope, resourceFactory, routeParams, location,dateFilter) {
        scope.loanId = routeParams.loanId;
        scope.formData = {};
        scope.pdcData = [];
        scope.date = {};
        scope.pdcTypes = [{id:1,name:"Full PDC"},{id:2,name:"Security PDC"},{id:3, name:"Partial PDC"}];
        var x ;
        resourceFactory.LoanAccountResource.getLoanAccountDetails({loanId: routeParams.loanId, associations: 'repaymentSchedule', exclude: 'guarantors'}, function(data){
          scope.loandetails = data;

        });

        resourceFactory.paymentInventoryTemplateResource.get({loanId: scope.loanId}, function(data){
          scope.paymentInventoryTemplates = data;
          scope.pdcData = scope.paymentInventoryTemplates.repayment.periods;
          scope.pdcData.splice(0,1);
          for (var i in scope.pdcData){
              scope.pdcData[i].dueDate = new Date(scope.pdcData[i].dueDate);
          }
          scope.changeData = function(value){
            if (value){
                var length = scope.pdcData.length;
                
                var pdcDataFirst = scope.pdcData[0];
                var pdcDataLast = scope.pdcData[length - 1 ];
                
                scope.pdcData = [];
                scope.pdcData.push(pdcDataFirst, pdcDataLast);
          }else {
            delete scope.pdcData;
            scope.pdcData = [];
            scope.pdcData = scope.paymentInventoryTemplates.repayment.periods;

          }
        }
        scope.changePdcData = function(type){
          x=type;
          scope.pdcData = scope.loandetails.repaymentSchedule.periods;
            if (type == 2 ){
              console.log(type);
              scope.pdcData = [];
              scope.pdcData.push({ifscCode: scope.pdcData.ifscCode, micrCode: scope.pdcData.micrCode, presentationStatus:1,makePresentation: false,  period: scope.pdcData.period, chequeNo: scope.pdcData.chequeno, amount: scope.pdcData.totalInstallmentAmountForPeriod, chequeDate: dateFilter(scope.pdcData.dueDate, scope.df), date: dateFilter(scope.pdcData.dueDate, scope.df), nameOfBank:scope.pdcData.nameOfBank, branchName: scope.pdcData.branchName  });
            }else if (type == 3){
              console.log(type);
              var pdctemp = scope.pdcData;
              scope.pdcData = [];
              pdctemp[1].dueDate = new Date(pdctemp[1].dueDate);
              scope.pdcData.push(pdctemp[1]);
                   }
            else {
              scope.pdcData = scope.paymentInventoryTemplates.repayment.periods;

            }
        }
        scope.addInstallment = function (index) {
          if(x == 3)
            var pdcData = (
              {
                ifscCode: scope.pdcData.ifscCode,
                micrCode: scope.pdcData.micrCode,
                 presentationStatus: 1,
                 makePresentation: false,
                  period: index+2,
                  chequeNo: scope.pdcData.chequeno,
                  totalInstallmentAmountForPeriod: scope.loandetails.repaymentSchedule.periods[index+2].totalInstallmentAmountForPeriod,
                    amount: scope.pdcData.totalInstallmentAmountForPeriod,
                    chequeDate: dateFilter(scope.pdcData.dueDate, scope.df),
                      dueDate: new Date(scope.loandetails.repaymentSchedule.periods[index+2].dueDate),
                      nameOfBank:scope.pdcData.nameOfBank,
                        branchName: scope.pdcData.branchName });
            else
              var pdcData = (
              {
                ifscCode: scope.pdcData.ifscCode,
                micrCode: scope.pdcData.micrCode,
                 presentationStatus: 1,
                 makePresentation: false,
                  period: scope.pdcData.period,
                  chequeNo: scope.pdcData.chequeno,
                    amount: scope.pdcData.totalInstallmentAmountForPeriod,
                    chequeDate: dateFilter(scope.pdcData.dueDate, scope.df),
                      dueDate: dateFilter(scope.pdcData.dueDate, scope.df),
                      nameOfBank:scope.pdcData.nameOfBank,
                        branchName: scope.pdcData.branchName });
          
            scope.pdcData.splice(index+1, 0, pdcData);
            scope.pdcData.push() ;
            

        } ;

        scope.deleteInstallment = function (index) {
            scope.pdcData.splice(index, 1);
        } ;



        });

        scope.submit = function () {
            this.formData.locale = scope.optlang.code;
            this.formData.dateFormat = scope.df;
            if (scope.pdcData.length > 0){
                scope.formData.pdcData = [];
                //scope.formData.pdcData.push({isSeriesCheques: this.formData.isSeriesCheques,type:this.formData.pdcTypeId})
                if (scope.formData.pdcTypeId == 2){
                  this.formData.isSeriesCheques = false;
                  this.formData.pdcTypeId = 2;
                }
                else if(scope.formData.pdcTypeId == 3){
                  this.formData.isSeriesCheques = false;
                  this.formData.pdcTypeId = 3;
                }
                for (var i in scope.pdcData) {
                  if(scope.pdcData[i].ifscCode && scope.pdcData[i].micrCode && scope.pdcData[i].chequeno && scope.pdcData[i].totalInstallmentAmountForPeriod && dateFilter(scope.pdcData[i].dueDate, scope.df) && dateFilter(scope.pdcData[i].dueDate, scope.df) && scope.pdcData[i].nameOfBank && scope.pdcData[i].branchName){
                      scope.formData.pdcData.push({ifscCode: scope.pdcData[i].ifscCode, micrCode: scope.pdcData[i].micrCode, presentationStatus:1,makePresentation: false,  period: scope.pdcData[i].period, chequeNo: scope.pdcData[i].chequeno, amount: scope.pdcData[i].totalInstallmentAmountForPeriod, chequeDate: dateFilter(scope.pdcData[i].dueDate, scope.df), date: dateFilter(scope.pdcData[i].dueDate, scope.df), nameOfBank:scope.pdcData[i].nameOfBank, branchName: scope.pdcData[i].branchName  });
                    console.log(scope.formData.pdcData);
                  }
                }


            }

            resourceFactory.PaymentInventoryResource.save( {loanId: scope.loanId}, this.formData, function (data) {
                location.path('/viewloanaccount/' + data.loanId);
            });
        };

        }
    });
    mifosX.ng.application.controller('AddPaymentInventory', ['$scope', 'ResourceFactory', '$routeParams', '$location','dateFilter', mifosX.controllers.AddPaymentInventory]).run(function ($log) {
        $log.info("AddPaymentInventory initialized");
    });
}(mifosX.controllers || {}));
