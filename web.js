import { app } from "../../scripts/app.js";

console.log("🔵 [ApiPlaceholder] Loading ComfyUI-ApiPlaceholder extension...");

app.registerExtension({
    name: "Comfy.ApiPlaceholder",
    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        
        if (nodeData.name === "ApiPlaceholder") {
            const onNodeCreated = nodeType.prototype.onNodeCreated;
            
            nodeType.prototype.onNodeCreated = function() {
                const result = onNodeCreated ? onNodeCreated.apply(this, arguments) : undefined;
                
                // Helper function to update the connections JSON widget
                this.updateConnectionsWidget = function() {

                    const connectionsWidget = this.widgets?.find(w => w.name === "connections");
                    if (connectionsWidget) {
                        const outputConnections = {};
                        
                        if (this.widgets) {
                            for (let i = 0; i < 20; i++) {
                                const widget = this.widgets[i];
                                if (widget && widget.value) {
                                    outputConnections[i] = {
                                        index: i,
                                        target: widget.label,
                                        placeholder: widget.value || ""
                                    };
                                }
                            }

                            const connectionsJson = JSON.stringify(outputConnections, null, 2);
                            connectionsWidget.value = connectionsJson;
                        }
                    }

                };
                
                // Helper function to restore labels from connections widget
                this.restoreConnectionLabels = function() {
                    const connectionsWidget = this.widgets?.find(w => w.name === "connections");
                    if (connectionsWidget && connectionsWidget.value) {
                        console.log("🔵 [ApiPlaceholder] Restoring connections from widget:", connectionsWidget.value);
                        try {
                            const connections = JSON.parse(connectionsWidget.value);
                            if (Object.keys(connections).length > 0) {
                                for (const [indexStr, connectionData] of Object.entries(connections)) {
                                    const index = parseInt(indexStr);
                                    
                                    // Update widget label and value
                                    if (this.widgets && this.widgets[index]) {
                                        if (connectionData.target) {
                                            this.widgets[index].label = connectionData.target;
                                        }
                                        if (connectionData.placeholder) {
                                            this.widgets[index].value = connectionData.placeholder;
                                        }
                                    }
                                    
                                    // Update output label
                                    if (this.outputs && this.outputs[index]) {
                                        const outputLabel = connectionData.placeholder && connectionData.target 
                                            ? `${connectionData.placeholder} → ${connectionData.target}`
                                            : connectionData.target || this.outputs[index].label;
                                        this.outputs[index].label = outputLabel;
                                        if (connectionData.target) {
                                            this.outputs[index].name = connectionData.target;
                                        }
                                    }
                                }
                                
                                // Force redraw to show restored labels
                                if (this.setDirtyCanvas) {
                                    this.setDirtyCanvas(true, true);
                                }
                            }
                        } catch (e) {
                            console.error("🔴 [ApiPlaceholder] Failed to parse connections JSON:", e);
                        }
                    }
                };
                                
                // Add callbacks to input widgets to update output labels when manually edited
                if (this.widgets) {
                    for (let i = 0; i < 20; i++) {
                        const widget = this.widgets[i];
                        if (widget) {
                            const originalCallback = widget.callback;
                            const outputIndex = i; // Map widget index to output index
                            
                            widget.callback = function(value) {
                                
                                // Update the corresponding output label
                                const node = this;
                                if (node && node.outputs && node.outputs[outputIndex]) {
                                    const outputLabel = value ? `${value} → ${widget.label}` : widget.label;
                                    node.outputs[outputIndex].label = outputLabel;
                                    
                                    // Force redraw
                                    if (node.setDirtyCanvas) {
                                        node.setDirtyCanvas(true, true);
                                    }

                                    this.updateConnectionsWidget();
                                }
                                
                                // Call original callback if it exists
                                if (originalCallback) {
                                    originalCallback.apply(this, arguments);
                                }
                            }.bind(this);
                        }
                    }
                }
                
                this.onConnectOutput = function(outputIndex, inputType, inputSlot, inputNode, inputIndex) {
                    console.log("🔵 [ApiPlaceholder] onConnectOutput called:", {
                        outputIndex,
                        inputType,
                        inputSlot,
                        inputNode: inputNode ? {id: inputNode.id, type: inputNode.type} : null,
                        inputIndex
                    });

                    // console.log(this.widgets[outputIndex]);
                    // console.log(this.outputs[outputIndex]);
                    
                    // When output is connected, update the corresponding input widget
                    if (inputNode && inputNode.inputs && inputNode.inputs[inputIndex]) {
                        const inputName = inputNode.inputs[inputIndex].name;
                        const nodeId = inputNode.id;
                        
                        // Update the corresponding input widget
                        const widgetIndex = outputIndex;
                        if (this.widgets && this.widgets[widgetIndex]) {
                            
                            // Update widget label to show connection info
                            const widgetLabel = `${nodeId}.${inputName}`;
                            this.widgets[widgetIndex].label = widgetLabel;
                            if (this.widgets[widgetIndex].value === "") {
                                this.widgets[widgetIndex].value = inputName;
                            }

                            // Update output label to show connection info
                            if (this.outputs && this.outputs[outputIndex]) {
                                const outputLabel = `${this.widgets[widgetIndex].value} → ${widgetLabel}`;
                                this.outputs[outputIndex].label = outputLabel;
                                this.outputs[outputIndex].name = widgetLabel;
                                
                                // Force node to redraw to show new label
                                if (this.setDirtyCanvas) {
                                    this.setDirtyCanvas(true, true);
                                }
                            }

                        }
                        

                        // Update the connections widget
                        this.updateConnectionsWidget();
                    }
                    
                    // Return false to PREVENT the actual connection (only store metadata)
                    return false;
                };
                
                return result;
            };
            
            // Override onConfigure to restore labels when loading from saved workflow
            const onConfigure = nodeType.prototype.onConfigure;
            nodeType.prototype.onConfigure = function(info) {
                const result = onConfigure ? onConfigure.apply(this, arguments) : undefined;
                
                console.log("🔵 [ApiPlaceholder] onConfigure called, restoring labels...");
                // Restore labels after configuration is loaded
                // Use requestAnimationFrame to sync with rendering cycle
                if (this.restoreConnectionLabels) {
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            if (this.restoreConnectionLabels) {
                                this.restoreConnectionLabels();
                                // Force a full canvas redraw
                                if (app.graph && app.graph.setDirtyCanvas) {
                                    app.graph.setDirtyCanvas(true, true);
                                }
                            }
                        });
                    });
                }
                
                return result;
            };
            
            // Override onAdded to restore labels when node is added to graph
            const onAdded = nodeType.prototype.onAdded;
            nodeType.prototype.onAdded = function() {
                const result = onAdded ? onAdded.apply(this, arguments) : undefined;
                
                console.log("🔵 [ApiPlaceholder] onAdded called, restoring labels...");
                // Restore labels when node is added to graph (e.g., on import)
                if (this.restoreConnectionLabels) {
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            if (this.restoreConnectionLabels) {
                                this.restoreConnectionLabels();
                                // Force a full canvas redraw
                                if (app.graph && app.graph.setDirtyCanvas) {
                                    app.graph.setDirtyCanvas(true, true);
                                }
                            }
                        });
                    });
                }
                
                return result;
            };
        }
    }
});
