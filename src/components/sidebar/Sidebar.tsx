import { Box } from "@mui/material";
import { useState } from "react";
import Dag from "../../dag/Dag";
import { AppConfig } from "../../model/AppConfig";
import ZoomItem from "../base/ZoomItem";
import ConnectionIssuesIndicator from "./ConnectionIssuesIndicator";
import StarcoinLogo from "./StarcoinButton";
import ScaleButtons from "./ScaleButtons";
import TrackButton from "./TrackButton";

const Sidebar = ({dag, appConfig}: {dag: Dag, appConfig: AppConfig | null}) => {
    const [isTrackingState, setTrackingState] = useState(true);
    const [isHavingConnectionIssuesState, setHavingConnectionIssuesState] = useState(false);
    const [dagScaleState, setDagScaleState] = useState(dag.getScale())
    
    dag.setIsTrackingChangedListener(isTracking => setTrackingState(isTracking));
    dag.setIsFetchFailingListener(isFailing => setHavingConnectionIssuesState(isFailing));

    return (
        <Box sx={{
            padding: 0,
            margin: 0,
                
            position: 'absolute',
            top: '2vw',
            bottom: '2vw',
            right: '2.5vw',
            width: '92px',

            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '24px',
        }}>
            <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px',
                }}>
                <StarcoinLogo appConfig={appConfig} />
            </Box>

            <ZoomItem visible={isHavingConnectionIssuesState}>
                <ConnectionIssuesIndicator/>
            </ZoomItem>

            <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px',
                }}>
                <ZoomItem visible={true}>
                    <ScaleButtons
                        scale={dagScaleState}
                        minScale={0.2}
                        maxScale={1.2}
                        onIncrease={() => { 
                            dag.zoomOut();
                            setDagScaleState(dag.getScale());
                         }}
                        onDecrease={() => {
                            dag.zoomIn();
                            setDagScaleState(dag.getScale());
                        }}
                    />
                </ZoomItem>
                <ZoomItem visible={true}>
                    <TrackButton isTracking={isTrackingState} onClick={() => isTrackingState ? dag.setStateTrackCurrent() : dag.setStateTrackHead()}/>
                </ZoomItem>
            </Box>
        </Box>
    );
}

export default Sidebar;