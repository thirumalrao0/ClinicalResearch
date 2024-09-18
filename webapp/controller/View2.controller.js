sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast"
],
    function (Controller,
        Fragment,
        MessageToast,
    ) {
        "use strict";

        return Controller.extend("task.thirumal.controller.View2", {
            onInit: function () {
                this.fmodel = this.getOwnerComponent().getModel()
                var oRouter = this.getOwnerComponent().getRouter()
                this.fmodel.setDeferredGroups(this.fmodel.getDeferredGroups().concat(
                    ["create", "update"]
                ))
                oRouter.getRoute("RouteView2").attachPatternMatched(this.onObjectMethod, this)

            },
            onObjectMethod(evn) {
                this.spath = window.decodeURIComponent(evn.getParameter("arguments").path);
                this.getView().bindElement({ path: this.spath })
                this.editAll(false)
            },
            globleFragment(path) {
                return Fragment.load({
                    id: this.getView().getId(),
                    name: path,
                    controller: this
                }).then((frag) => {
                    this.getView().addDependent(frag)
                    return frag
                })
            },
            deleteItem(){
                this.fmodel.remove(this.spath);
                this.getOwnerComponent().getRouter().navTo("RouteView1")
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
               
                this.byId("idDiscard").setVisible(para)
            },

            edit() {
                this.editAll(true)
            },

            cancel() {
                this.editAll(false)
            },
            save() {
                this.fmodel.submitChanges()
                
                this.editAll(false)
            },
            discard: function () {
                // Reset the form fields to their original values
                this.fmodel.resetChanges(); // Resets changes for the whole model



            },
            globelForm(evn, path) {


                var frag = this.globleFragment(path).then((frag) => {
                    var gObj = evn.getSource().getBindingContext().getObject()
                    if (path === "task.thirumal.fragments.addRegInfo" || path === "task.thirumal.fragments.addSpec") {
                        var sitecode = {
                            Sitecode: gObj.SiteCode
                        };
                    } else {
                        var sitecode = {
                            SiteCode: gObj.SiteCode
                        };
                    }


                    var spath = evn.getSource().getBindingContext().getPath()
                    var tableBindingpath = evn.getSource().getParent().getParent().getTableBindingPath()
                    var oContex = this.fmodel.createEntry(`${spath}/${tableBindingpath}`, {
                        groupId: "create",
                        properties: sitecode

                    })
                    frag.setBindingContext(oContex)
                    frag.open()

                })
            },

            add1(evn) {
                this.globelForm(evn, "task.thirumal.fragments.addFacilities")


            },
            addEdu(evn) {
                this.globelForm(evn, "task.thirumal.fragments.addEducation")
            },
            addPE(evn) {
                this.globelForm(evn, "task.thirumal.fragments.addProExp")
            },
            addEnse(evn) {
                this.globelForm(evn, "task.thirumal.fragments.addEnse")
            },
            onGcp(evn) {
                this.globelForm(evn, "task.thirumal.fragments.addGcp")
            },
            addSepc(evn) {
                this.globelForm(evn, "task.thirumal.fragments.addSpec")
            },
            addTCRE(evn) {
                this.globelForm(evn, "task.thirumal.fragments.addTCRE")
            },
            addRegInfo(evn) {
                this.globelForm(evn, "task.thirumal.fragments.addRegInfo")
            },
            onAdd1(evn) {
                this.fmodel.submitChanges({
                    success: () => {
                        MessageToast.show("added")
                        evn.getSource().getParent().getParent().close()

                    },
                    error: () => {
                        MessageToast.show(err)
                    }
                }, { groupId: "create" })

            },
            onCancel1(evn) {
                this.fmodel.resetChanges();
                evn.getSource().getParent().getParent().close()

            },
            deleteFormItems(evn) {
                // Get the SmartTable from the event source
                var oSmartTable = evn.getSource().getParent().getParent(); // Adjust according to the actual structure of your XML view

                // Get the table associated with the SmartTable
                var gTable = oSmartTable.getTable();
                var indices = gTable.getSelectedIndices()
                // Retrieve selected indices from the table
                indices.forEach(index => {
                    var spath = gTable.getContextByIndex(index).getPath()
                    this.fmodel.remove(spath, {
                        success: () => {
                            MessageToast.show("Deleted");

                        },
                        error: (err) => {
                            MessageToast.show("Error: " + err.message);
                        }
                    });

                });
            }
        });
    });
