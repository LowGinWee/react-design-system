import { fabric } from "fabric";
import {
    Ref,
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
} from "react";
import { useTheme } from "styled-components";
import { Color } from "../color";
import {
    SignatureCanvas,
    SignatureCanvasContainer,
} from "./e-signature.styles";
import { ESignatureCanvasProps, ESignatureCanvasRef } from "./types";
import { BaseTheme } from "../theme";

const Component = (
    props: ESignatureCanvasProps,
    ref: Ref<ESignatureCanvasRef>
) => {
    // =============================================================================
    // CONST, STATE, REF
    // =============================================================================
    const { baseImageDataURL } = props;
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricCanvas = useRef<fabric.Canvas>();
    const pencilBrush = useRef<fabric.PencilBrush>();
    const theme = useTheme();

    // =============================================================================
    // HOOKS
    // =============================================================================
    useImperativeHandle(ref, () => ({
        clear: () => fabricCanvas.current?.clear(),
        export: () => exportAsImage(),
    }));

    // =============================================================================
    // HELPER FUNCTIONS
    // =============================================================================
    const exportAsImage = () => {
        if (!fabricCanvas.current.getObjects().length) return null;
        const dataURL = fabricCanvas.current?.toDataURL({
            format: "png",
            quality: 1,
            enableRetinaScaling: true,
        });
        return dataURL;
    };

    const handleResize = useCallback(async () => {
        if (containerRef.current && canvasRef.current && fabricCanvas.current) {
            // slight delay for fabricjs to update on orientation change
            await new Promise((resolve) => setTimeout(resolve));

            const canvasWidth = containerRef.current?.clientWidth;
            const canvasHeight = containerRef.current.clientHeight;
            canvasRef.current.width = canvasWidth;
            canvasRef.current.height = canvasHeight;
            fabricCanvas.current.setWidth(canvasWidth);
            fabricCanvas.current.setHeight(canvasHeight);

            // change x and y position of the viewport to centralise the drawing
            const viewport = fabricCanvas.current.viewportTransform;
            viewport[4] = (canvasWidth - 640) / 2;
            viewport[5] = (canvasHeight - 320) * 0.75;
        }
    }, []);

    // =============================================================================
    // EFFECTS
    // =============================================================================
    // initialise fabric and brushes
    useEffect(() => {
        if (containerRef.current && canvasRef.current) {
            fabricCanvas.current = new fabric.Canvas("eSignatureCanvas");
            fabricCanvas.current.selection = false;
            fabricCanvas.current.isDrawingMode = true;

            pencilBrush.current = new fabric.PencilBrush(fabricCanvas.current);
            pencilBrush.current.color = `#${Color.Neutral[8]({
                theme: theme || BaseTheme,
            })}`;
            pencilBrush.current.width = 3;

            fabricCanvas.current.freeDrawingBrush = pencilBrush.current;
        }
    }, []);

    // resize
    useEffect(() => {
        if (window) {
            window.addEventListener("resize", handleResize);
            screen.orientation?.addEventListener("change", handleResize);
            handleResize();
            return () => {
                window.removeEventListener("resize", handleResize);
                screen.orientation?.removeEventListener("change", handleResize);
            };
        }
    }, [handleResize]);

    // update base image
    useEffect(() => {
        if (baseImageDataURL) {
            fabric.Image.fromURL(baseImageDataURL, (img) => {
                if (fabricCanvas.current) {
                    fabricCanvas.current?.clear();
                    img.selectable = false;
                    img.hoverCursor = "default";
                    img.scale(0.5);

                    const viewport = fabricCanvas.current.viewportTransform;
                    img.left = -viewport[4];
                    img.top = -viewport[5];

                    fabricCanvas.current.add(img);
                }
            });
        }
    }, [baseImageDataURL]);

    // =============================================================================
    // RENDER FUNCTIONS
    // =============================================================================
    return (
        <SignatureCanvasContainer ref={containerRef}>
            <SignatureCanvas id="eSignatureCanvas" ref={canvasRef} />
        </SignatureCanvasContainer>
    );
};

export const ESignatureCanvas = forwardRef<
    ESignatureCanvasRef,
    ESignatureCanvasProps
>(Component);
