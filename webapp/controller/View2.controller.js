sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    function (Controller,) {
        "use strict";

        return Controller.extend("task.thirumal.controller.View2", {
            onInit: function () {
                this.fmodel = this.getOwnerComponent().getModel()
                var oRouter = this.getOwnerComponent().getRouter()
                this.fmodel.setDeferredGroups(this.fmodel.getDeferredGroups().concat(
                    "createChanges"
                ))
                oRouter.getRoute("RouteView2").attachPatternMatched(this.onObjectMethod, this)

            },
            onObjectMethod(evn) {
                var path = window.decodeURIComponent(evn.getParameter("arguments").path);
                this.getView().bindElement({ path: path })
                this.editAll(false)
            },

            editAll(para) {
                this.byId("smartFormNameTitle").setEditable(para)
                this.byId("smartFormClinicalPhase").setEditable(para)
                this.byId("smartFormCompanyAddress").setEditable(para)
                this.byId("smartFormCommunication").setEditable(para)
                this.byId("smartFormResearchExperience").setEditable(para)
                this.byId("smartFormLogDetails").setEditable(para)
                this.byId("idSaveButton").setVisible(para)
                this.byId("idCancelButton").setVisible(para)
                this.byId("idspec").setEditable(para)
                this.byId("idDiscard").setVisible(para)
            },

            edit() {
                this.editAll(true)
            },

            cancel() {
                this.editAll(false)
            },
            save() {
                this.fmodel.submitChanges({ groupid: "update" })
                this.getOwnerComponent().getRouter().navTo("RouteView1")
                this.editAll(false)
            },
            discard: function () {
                // Reset the form fields to their original values
                this.fmodel.resetChanges(); // Resets changes for the whole model



            }






        });
    });
