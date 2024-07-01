import { Box, ButtonBase, Tooltip, useTheme } from "@mui/material";
import { AppConfig, isMainnet, isTestnet } from "../../model/AppConfig";
import AnimatedItem from "../base/AnimatedItem";

const StarcoinLogo = ({ appConfig }: {appConfig: AppConfig | null}) => {
    const theme = useTheme();
    let logoColor = theme.palette.brand.logo.main;
    let logoBkgColor = theme.palette.background.paper;

    if (appConfig) {
        if (isMainnet(appConfig)) {
            // Do nothing
        } else if (isTestnet(appConfig)) {
            logoColor = theme.palette.background.paper;
            logoBkgColor = theme.palette.brand.logo.main;
        } else {
            logoColor = theme.palette.primary.light;
        }
    }

    return (
        <AnimatedItem borderRadius={"50px"} magnify={1.03}>
            <Tooltip
                title={
                    <Box sx={{
                        fontWeight: 'normal',
                        fontSize: '1.2em'
                    }}>
                        <strong>Starcoin Dag Inspector (SDI)</strong><br/>
                        <br/>
                        SDI: v{appConfig ? appConfig.webVersion : "n/a"}<br/>
                        Starcoind: v{appConfig ? appConfig.starcoinVersion : "n/a"}<br/>
                        <br/>
                        Network: <strong>{appConfig ? appConfig.network : "n/a"}</strong>
                    </Box>
                }
                placement="left"
                arrow
                enterDelay={theme.transitions.duration.enteringScreen*1.5}
            >
                <ButtonBase color="primary" sx={{borderRadius: '50%'}} focusRipple>
                    <Box sx={{
                        borderRadius: '50%',
                        borderStyle: 'solid',
                        borderColor: logoBkgColor,
                        borderWidth: '6px',
                        height: '92px',
                        backgroundColor: logoBkgColor
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 297.96 297.96" width="80" height="80">
                            <g id="图层_2" data-name="图层 2">
                                <g id="Layer_1" data-name="Layer 1">
                                    <circle style={{ fill: logoColor }} cx="148.98" cy="148.98" r="148.98"/>
                                    <path style={{ fill: "#fff" }} d="M101.13,209c-17.16,5.21-30.8,5.07-34.78-.38s.09-18.58,10.39-33.4a172.63,172.63,0,0,1,15-18.41l-11-8.16a185,185,0,0,0-15.17,18.78C46.93,194.22,49.71,209,55.32,216.69c4.79,6.57,12.83,9.9,23.9,9.9,7.4,0,16.18-1.54,26.1-4.57,2.6-.79,5.5-1.79,8.85-3Z"/>
                                    <path style={{ fill: "#fff" }} d="M246.56,77.22c-10.11-13.87-35.72-13-70.3,2.45l4.14,13A169.6,169.6,0,0,1,200.55,85c8.36-2.56,16-3.91,22.09-3.91,6.42,0,10.88,1.46,12.89,4.22,4,5.47-.09,18.58-10.39,33.4-7.77,11.18-18.78,23.27-31.86,35-3.41,3-6.92,6-10.45,8.91l-.43.35,13.79,42.47-35.91-26.1-.48.32c-3.84,2.59-7.7,5.06-11.47,7.36a249.47,249.47,0,0,1-27.53,14.6L134,160.92l-37.2-27h46L157,90.15l14.21,43.74h31.56a129.24,129.24,0,0,0,12.05-14.37H181.64L169.69,82.74h-25.4l-11.95,36.78H93.67l-7.85,24.16,31.28,22.73-11.95,36.77,17.27,12.55.43-.18a263.42,263.42,0,0,0,36.37-19.32l31.05,22.57,20.55-14.93-12-37C230.84,139,262.41,99,246.56,77.22Z"/>
                                </g>
                            </g>
                        </svg>
                    </Box>
                </ButtonBase>
            </Tooltip>
        </AnimatedItem>
    );
}

export default StarcoinLogo;
