(function (module) {
    mifosX.controllers = _.extend(module, {
        AddPaymentInventory: function (scope, resourceFactory, routeParams, location,dateFilter) {
        scope.loanId = routeParams.loanId;
        scope.formData = {};
        scope.pdcData = [];
        scope.date = {};
        scope.pdcTypes = [{id:1,name:"Full PDC"},{id:2,name:"SecurityPDC"}];

        //scope.date.dueDate = new Date();

        //scope.pdcType = 'Full Pdc';

        resourceFactory.LoanAccountResource.getLoanAccountDetails({loanId: routeParams.loanId, associations: 'repaymentSchedule', exclude: 'guarantors'}, function(data){
          scope.loandetails = data;

        });

        resourceFactory.paymentInventoryTemplateResource.get({loanId: scope.loanId}, function(data){
          scope.paymentInventoryTemplates = data;
          //var lenth = scope.paymentInventoryTemplates.periods.length;
          scope.pdcData = scope.paymentInventoryTemplates.repayment.periods;
          scope.pdcData.splice(0,1);
          for (var i in scope.pdcData){
              scope.pdcData[i].dueDate = new Date(scope.pdcData[i].dueDate);
          }
          scope.changeData = function(value){
            if (value){

                var length = scope.pdcData.length;
                //Get First Element
                var pdcDataFirst = scope.pdcData[0];
                var pdcDataLast = scope.pdcData[length - 1 ];
                //We need only first and last elements
                scope.pdcData = [];

                scope.pdcData.push(pdcDataFirst, pdcDataLast);




          }else {
            delete scope.pdcData;
            scope.pdcData = [];
            scope.pdcData = scope.paymentInventoryTemplates.repayment.periods;

          }
        }
        scope.changePdcData = function(type){
            if (type == 2){
              console.log(type);
              scope.pdcData = [];
              scope.pdcData.push({ifscCode: scope.pdcData.ifscCode, micrCode: scope.pdcData.micrCode, presentationStatus:1,makePresentation: false,  period: scope.pdcData.period, chequeNo: scope.pdcData.chequeno, amount: scope.pdcData.totalInstallmentAmountForPeriod, chequeDate: dateFilter(scope.pdcData.dueDate, scope.df), date: dateFilter(scope.pdcData.dueDate, scope.df), nameOfBank:scope.pdcData.nameOfBank, branchName: scope.pdcData.branchName  });


            }else {
              scope.pdcData = scope.paymentInventoryTemplates.repayment.periods;

            }
        }
        scope.addInstallment = function (index) {
            var pdcData = (
              {ifscCode: scope.pdcData.ifscCode,
                micrCode: scope.pdcData.micrCode,
                 presentationStatus:2,
                 makePresentation: false,
                  period: scope.pdcData.period,
                   chequeNo: scope.pdcData.chequeno,
                    amount: scope.pdcData.totalInstallmentAmountForPeriod,
                     chequeDate: dateFilter(scope.pdcData.dueDate, scope.df),
                      date: dateFilter(scope.pdcData.dueDate, scope.df),
                       nameOfBank:scope.pdcData.nameOfBank,
                       branchName: scope.pdcData.branchName }) ;
            scope.pdcData.splice(index+1, 0, pdcData);
            scope.pdcData.push() ;

        } ;

        scope.deleteInstallment = function (index) {
            scope.pdcData.splice(index, 1);
        } ;



        });

        scope.submit = function () {
            //var date = dateFilter(scope.date.dueDate, scope.df);
            this.formData.locale = scope.optlang.code;
            this.formData.dateFormat = scope.df;
            if (scope.pdcData.length > 0){
                scope.formData.pdcData = [];
                //scope.formData.pdcData.push({isSeriesCheques: this.formData.isSeriesCheques,type:this.formData.pdcTypeId})
                if (scope.formData.pdcTypeId == 2){
                  this.formData.isSeriesCheques = false;
                  this.formData.pdcTypeId = 2;
                }
                for (var i in scope.pdcData) {
                      scope.formData.pdcData.push({ifscCode: scope.pdcData[i].ifscCode, micrCode: scope.pdcData[i].micrCode, presentationStatus:2,makePresentation: false,  period: scope.pdcData[i].period, chequeNo: scope.pdcData[i].chequeno, amount: scope.pdcData[i].totalInstallmentAmountForPeriod, chequeDate: dateFilter(scope.pdcData[i].dueDate, scope.df), date: dateFilter(scope.pdcData[i].dueDate, scope.df), nameOfBank:scope.pdcData[i].nameOfBank, branchName: scope.pdcData[i].branchName  });
                    console.log(scope.formData.pdcData);
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
