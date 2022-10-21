/**
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

 import React, { useState, FunctionComponent, useEffect, useCallback } from "react";
 import { Button, SafeAreaView, StatusBar, View, ViewProps } from "react-native";
 import { EngineView, useEngine } from "@babylonjs/react-native";
 import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
 import { Camera } from "@babylonjs/core/Cameras/camera";
 import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
 import "@babylonjs/loaders/glTF";
 import { Scene } from "@babylonjs/core/scene";
 import { WebXRSessionManager, WebXRTrackingState } from "@babylonjs/core/XR";
import { ActionManager, ExecuteCodeAction } from "@babylonjs/core";
 
 const EngineScreen: FunctionComponent<ViewProps> = (props: ViewProps) => {
   const engine = useEngine();
   const [camera, setCamera] = useState<Camera>();
   const [xrSession, setXrSession] = useState<WebXRSessionManager>();
   const [trackingState, setTrackingState] = useState<WebXRTrackingState>();
   const [scene, setScene] = useState<Scene>();
 
   const onToggleXr = useCallback(() => {
     (async () => {
       if (xrSession) {
         await xrSession.exitXRAsync();
       } else {
         if (scene !== undefined) {
           const xr = await scene.createDefaultXRExperienceAsync({
             disableDefaultUI: true,
             disableTeleportation: true,
           });
           const session = await xr.baseExperience.enterXRAsync(
             "immersive-ar",
             "unbounded",
             xr.renderTarget,
           );
           setXrSession(session);
           session.onXRSessionEnded.add(() => {
             setXrSession(undefined);
             setTrackingState(undefined);
           });
 
           setTrackingState(xr.baseExperience.camera.trackingState);
           xr.baseExperience.camera.onTrackingStateChanged.add(
             newTrackingState => {
               setTrackingState(newTrackingState);
             },
           );
         }
       }
     })();
   }, [scene, xrSession]);
 
   useEffect(() => {
    if (engine) {
      const newScene = new Scene(engine);
      setScene(newScene);
      newScene.createDefaultCameraOrLight(true, undefined, true);
      (newScene.activeCamera as ArcRotateCamera).alpha += Math.PI;
      (newScene.activeCamera as ArcRotateCamera).radius = 1;
      setCamera(newScene.activeCamera!);
      SceneLoader.ImportMesh(
        '',
        'https://assets.babylonjs.com/meshes/Alien/Alien.gltf',
        '',
        newScene,
        models => {
          const mesh = models[0];
          mesh.actionManager = new ActionManager();
          console.warn(
            'Start logging actions, mesh.actionManager: ' + mesh.actionManager,
          );

          mesh.actionManager.registerAction(
            new ExecuteCodeAction(ActionManager.OnPickTrigger, function () {
              //console.warn('CLICK');
            }),
          );
          mesh.actionManager.registerAction(
            new ExecuteCodeAction(
              ActionManager.OnPointerOverTrigger,
              function () {
                //console.warn('HOVER');
              },
            ),
          );
          mesh.actionManager.registerAction(
            new ExecuteCodeAction(
              ActionManager.OnPointerOutTrigger,
              function () {
                //console.warn('HOVER EXIT');
              },
            ),
          );

          // models.forEach(mesh => {
          //   mesh.actionManager = new ActionManager();

          //   mesh.actionManager.registerAction(
          //     new ExecuteCodeAction(ActionManager.OnPickTrigger, function () {
          //       // console.warn('CLICK');
          //     }),
          //   );
          //   mesh.actionManager.registerAction(
          //     new ExecuteCodeAction(
          //       ActionManager.OnPointerOverTrigger,
          //       function () {
          //         // console.warn('HOVER');
          //       },
          //     ),
          //   );
          //   mesh.actionManager.registerAction(
          //     new ExecuteCodeAction(
          //       ActionManager.OnPointerOutTrigger,
          //       function () {
          //         // console.warn('HOVER EXIT');
          //       },
          //     ),
          //   );
          // });
          console.warn('MODELS LOADED');
        },
      );
    }
  }, [engine]);
 
   return (
     <>
       <View style={props.style}>
         <Button
           title={xrSession ? "Stop XR" : "Start XR"}
           onPress={onToggleXr}
         />
         <View style={{ flex: 1 }}>
           <EngineView camera={camera} displayFrameRate={true} />
         </View>
       </View>
     </>
   );
 };
 
 const App = () => {
   return (
     <>
       <StatusBar barStyle="dark-content" />
       <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
         <EngineScreen style={{ flex: 1 }} />
       </SafeAreaView>
     </>
   );
 };
 
 export default App;
 