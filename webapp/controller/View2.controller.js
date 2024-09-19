sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
],
    function (Controller,
        Fragment,
        MessageToast,
        JSONModel, MessageBox
    ) {
        "use strict";

        return Controller.extend("task.thirumal.controller.View2", {
            onInit: function () {
                this.allDialogs = {}
                this.fmodel = this.getOwnerComponent().getModel()
                var oRouter = this.getOwnerComponent().getRouter()
                this.fmodel.setDeferredGroups(this.fmodel.getDeferredGroups().concat(
                    ["create", "update"]
                ))
                oRouter.getRoute("RouteView2").attachPatternMatched(this.onObjectMethod, this)
                var oModel = new JSONModel({
                    "isEditable": false
                })
                this.getView().setModel(oModel, "edit")

            },
            onObjectMethod(evn) {
                this.spath = window.decodeURIComponent(evn.getParameter("arguments").path);
                this.getView().bindElement({ path: this.spath })
                this.getView().getModel("edit").setProperty("/isEditable", false)
                var oView = this.getView()
                if (oView.getBindingContext()) {
                    oView.getBindingContext().getModel().refresh();
                }
                sap.ui.core.BusyIndicator.hide();

            },
            globleFragment(path) {
                var sDialog=path
             var pDialog=   this.allDialogs[sDialog]
             if(!pDialog){
                return Fragment.load({
                    id:path,
                    name: path,
                    controller: this
                }).then((frag) => {
                    this.getView().addDependent(frag)
                    this.allDialogs[sDialog]=frag
                    return frag
                })
             }else{
                return Promise.resolve(pDialog)
             }
                
            },
            // deleteItem(){
            //     this.fmodel.remove(this.spath);
            //     this.getOwnerComponent().getRouter().navTo("RouteView1")
            // },
            deleteItem: function () {

                MessageBox.warning("Are you sure you want to delete this item?", {
                    actions: ["Confirm", MessageBox.Action.CANCEL], //
                    emphasizedAction: "Confirm",
                    onClose: (sAction) => {
                        if (sAction === "Confirm") {
                            // If the user confirmed, proceed with the deletion
                            this.fmodel.remove(this.spath, {
                                success: () => {
                                    MessageToast.show("Item deleted successfully.");
                                    this.getOwnerComponent().getRouter().navTo("RouteView1");
                                },
                                error: () => {
                                    MessageToast.show("Error deleting item.");
                                }
                            });
                        }
                    },

                });
            },




            edit() {
                this.getView().getModel("edit").setProperty("/isEditable", true)
            },

            cancel() {
                this.getOwnerComponent().getRouter().navTo("RouteView1")
                this.getView().getModel("edit").setProperty("/isEditable", false)
            },
            save() {
                this.fmodel.submitChanges()

                this.getView().getModel("edit").setProperty("/isEditable", false)
            },
            discard: function () {
                // Reset the form fields to their original values
                this.fmodel.resetChanges(); // Resets changes for the whole model
                this.getView().getModel("edit").setProperty("/isEditable", false)


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
