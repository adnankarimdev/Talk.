/**
 * Running a local relay server will allow you to hide your API key
 * and run custom logic on the server
 *
 * Set the local relay server address to:
 * REACT_APP_LOCAL_RELAY_SERVER_URL=http://localhost:8081
 *
 * This will also require you to set OPENAI_API_KEY= in a `.env` file
 * You can run it with `npm run relay`, in parallel with `npm start`
 */
const LOCAL_RELAY_SERVER_URL: string =
  process.env.REACT_APP_LOCAL_RELAY_SERVER_URL || "";

import { useEffect, useRef, useCallback, useState } from "react";

import { RealtimeClient } from "@openai/realtime-api-beta";
import axios from "axios";
import { ItemType } from "@openai/realtime-api-beta/dist/lib/client.js";
import { WavRecorder, WavStreamPlayer } from "@/lib/wavtools/index.js";
import { useToast } from "@/components/ui/use-toast";
import {
  formCollectionInstructions,
  instructions,
} from "@/utils/conversation_config.js";
import { useRouter } from "next/navigation";
import { Question } from "@/components/Types/types";
import { WavRenderer } from "@/utils/wav_renderer";

import { X, Edit, Zap, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";

// import './ConsolePage.scss';
import { isJsxOpeningLikeElement } from "typescript";
import { strict } from "assert";
import { Label } from "../label";
import VoiceGridVisualization from "../real-time/VoiceGridVisualization";
import { Switch } from "../switch";
import { CustomerReviewInfoFromSerializer } from "@/components/Types/types";

/**
 * Type for result from get_weather() function call
 */
interface Coordinates {
  lat: number;
  lng: number;
  location?: string;
  temperature?: {
    value: number;
    units: string;
  };
  wind_speed?: {
    value: number;
    units: string;
  };
}

/**
 * Type for all event logs
 */
interface RealtimeEvent {
  time: string;
  source: "client" | "server";
  count?: number;
  event: { [key: string]: any };
}

interface QuestionsProps {
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  onCheckboxChange?: (
    questionId: string,
    option: string,
    checked: boolean
  ) => void;
  answers?: Record<string, string | string[]>;
  setAnswers: React.Dispatch<
    React.SetStateAction<Record<string, string | string[]>>
  >;
  handleSubmit: (realtimeAnswers:any) => Promise<void>;
}

export function RealTimeTypeForm({
  questions,
  setQuestions,
  answers,
  setAnswers,
  handleSubmit,
}: QuestionsProps) {
  /**
   * Ask user for API Key
   * If we're using the local relay server, we don't need this
   */
  const [isVAD, setIsVAD] = useState(false);
  const [clientFrequencies, setClientFrequencies] = useState<any>(
    new Float32Array([0])
  );
  const router = useRouter();
  const { toast } = useToast();
  const [serverFrequencies, setServerFrequencies] = useState<any>(
    new Float32Array([0])
  );

  const nonUseStateAnswers: any = {};

  const handleToggle = () => {
    setIsVAD((prev) => !prev);
    const newValue = !isVAD ? "server_vad" : "none";
    changeTurnEndType(newValue);
    console.log("Turn end type changed to:", newValue);
    // You can add any additional logic here
  };

  // to do- set open ai key immediately.
  const apiKey = "sk-proj-BkqMCfMCu8aJz0M19aj9T3BlbkFJCqFGN85AiM1NP2lJyrF1";

  /**
   * Instantiate:
   * - WavRecorder (speech input)
   * - WavStreamPlayer (speech output)
   * - RealtimeClient (API client)
   */
  const wavRecorderRef = useRef<WavRecorder>(
    new WavRecorder({ sampleRate: 24000 })
  );
  const wavStreamPlayerRef = useRef<WavStreamPlayer>(
    new WavStreamPlayer({ sampleRate: 24000 })
  );
  const clientRef = useRef<RealtimeClient>(
    new RealtimeClient(
      LOCAL_RELAY_SERVER_URL
        ? { url: LOCAL_RELAY_SERVER_URL }
        : {
            apiKey: apiKey,
            dangerouslyAllowAPIKeyInBrowser: true,
          }
    )
  );

  /**
   * References for
   * - Rendering audio visualization (canvas)
   * - Autoscrolling event logs
   * - Timing delta for event log displays
   */
  const clientCanvasRef = useRef<HTMLCanvasElement>(null);
  const serverCanvasRef = useRef<HTMLCanvasElement>(null);
  const eventsScrollHeightRef = useRef(0);
  const eventsScrollRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<string>(new Date().toISOString());

  /**
   * All of our variables for displaying application state
   * - items are all conversation items (dialog)
   * - realtimeEvents are event logs, which can be expanded
   * - memoryKv is for set_memory() function
   * - coords, marker are for get_weather() function
   */
  const [items, setItems] = useState<ItemType[]>([]);
  const [realtimeEvents, setRealtimeEvents] = useState<RealtimeEvent[]>([]);
  const [expandedEvents, setExpandedEvents] = useState<{
    [key: string]: boolean;
  }>({});
  const [isConnected, setIsConnected] = useState(false);
  const [canPushToTalk, setCanPushToTalk] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [memoryKv, setMemoryKv] = useState<{ [key: string]: any }>({});
  const [coords, setCoords] = useState<Coordinates | null>({
    lat: 37.775593,
    lng: -122.418137,
  });
  const [marker, setMarker] = useState<Coordinates | null>(null);

  /**
   * Utility for formatting the timing of logs
   */
  const formatTime = useCallback((timestamp: string) => {
    const startTime = startTimeRef.current;
    const t0 = new Date(startTime).valueOf();
    const t1 = new Date(timestamp).valueOf();
    const delta = t1 - t0;
    const hs = Math.floor(delta / 10) % 100;
    const s = Math.floor(delta / 1000) % 60;
    const m = Math.floor(delta / 60_000) % 60;
    const pad = (n: number) => {
      let s = n + "";
      while (s.length < 2) {
        s = "0" + s;
      }
      return s;
    };
    return `${pad(m)}:${pad(s)}.${pad(hs)}`;
  }, []);

  /**
   * When you click the API key
   */
  const resetAPIKey = useCallback(() => {
    const apiKey = prompt("OpenAI API Key");
    if (apiKey !== null) {
      localStorage.clear();
      localStorage.setItem("tmp::voice_api_key", apiKey);
      window.location.reload();
    }
  }, []);

  /**
   * Connect to conversation:
   * WavRecorder taks speech input, WavStreamPlayer output, client is API client
   */
  const connectConversation = useCallback(async () => {
    const client = clientRef.current;
    const wavRecorder = wavRecorderRef.current;
    const wavStreamPlayer = wavStreamPlayerRef.current;

    // Set state variables
    startTimeRef.current = new Date().toISOString();
    setIsConnected(true);
    setRealtimeEvents([]);
    setItems(client.conversation.getItems());

    // Connect to microphone
    await wavRecorder.begin();

    // Connect to audio output
    await wavStreamPlayer.connect();

    // Connect to realtime API
    await client.connect();
    client.sendUserMessageContent([
      {
        type: `input_text`,
        text: ``,
        // text: `For testing purposes, I want you to list ten car brands. Number each item, e.g. "one (or whatever number you are one): the item name".`
      },
    ]);

    if (client.getTurnDetectionType() === "server_vad") {
      await wavRecorder.record((data) => client.appendInputAudio(data.mono));
    }
  }, []);

  /**
   * Disconnect and reset conversation state
   */
  const disconnectConversation = useCallback(async () => {
    setIsConnected(false);
    setRealtimeEvents([]);
    setItems([]);
    setMemoryKv({});
    setCoords({
      lat: 37.775593,
      lng: -122.418137,
    });
    setMarker(null);

    const client = clientRef.current;
    client.disconnect();

    const wavRecorder = wavRecorderRef.current;
    await wavRecorder.end();

    const wavStreamPlayer = wavStreamPlayerRef.current;
    await wavStreamPlayer.interrupt();
  }, []);

  const deleteConversationItem = useCallback(async (id: string) => {
    const client = clientRef.current;
    client.deleteItem(id);
  }, []);

  /**
   * In push-to-talk mode, start recording
   * .appendInputAudio() for each sample
   */
  const startRecording = async () => {
    setIsRecording(true);
    const client = clientRef.current;
    const wavRecorder = wavRecorderRef.current;
    const wavStreamPlayer = wavStreamPlayerRef.current;
    const trackSampleOffset = await wavStreamPlayer.interrupt();
    if (trackSampleOffset?.trackId) {
      const { trackId, offset } = trackSampleOffset;
      await client.cancelResponse(trackId, offset);
    }
    await wavRecorder.record((data) => client.appendInputAudio(data.mono));
  };

  /**
   * In push-to-talk mode, stop recording
   */
  const stopRecording = async () => {
    setIsRecording(false);
    const client = clientRef.current;
    const wavRecorder = wavRecorderRef.current;
    await wavRecorder.pause();
    client.createResponse();
  };

  /**
   * Switch between Manual <> VAD mode for communication
   */
  const changeTurnEndType = async (value: string) => {
    const client = clientRef.current;
    const wavRecorder = wavRecorderRef.current;
    if (value === "none" && wavRecorder.getStatus() === "recording") {
      await wavRecorder.pause();
    }
    client.updateSession({
      turn_detection: value === "none" ? null : { type: "server_vad" },
    });
    if (value === "server_vad" && client.isConnected()) {
      await wavRecorder.record((data) => client.appendInputAudio(data.mono));
    }
    setCanPushToTalk(value === "none");
  };

  /**
   * Auto-scroll the event logs
   */
  useEffect(() => {
    if (eventsScrollRef.current) {
      const eventsEl = eventsScrollRef.current;
      const scrollHeight = eventsEl.scrollHeight;
      // Only scroll if height has just changed
      if (scrollHeight !== eventsScrollHeightRef.current) {
        eventsEl.scrollTop = scrollHeight;
        eventsScrollHeightRef.current = scrollHeight;
      }
    }
  }, [realtimeEvents]);

  /**
   * Auto-scroll the conversation logs
   */
  useEffect(() => {
    const conversationEls = [].slice.call(
      document.body.querySelectorAll("[data-conversation-content]")
    );
    for (const el of conversationEls) {
      const conversationEl = el as HTMLDivElement;
      conversationEl.scrollTop = conversationEl.scrollHeight;
    }
  }, [items]);

  useEffect(() => {
    let isLoaded = true;

    const wavRecorder = wavRecorderRef.current;
    const wavStreamPlayer = wavStreamPlayerRef.current;

    const render = () => {
      if (!isLoaded) return;

      // Fetch client frequencies
      const clientFrequencies = wavRecorder?.recording
        ? wavRecorder.getFrequencies("voice")
        : { values: new Float32Array([0]) };

      // Fetch server frequencies
      const serverFrequencies = wavStreamPlayer?.analyser
        ? wavStreamPlayer.getFrequencies("voice")
        : { values: new Float32Array([0]) };

      // Update state for the visualization components
      setClientFrequencies(clientFrequencies.values); // Update state with values only
      setServerFrequencies(serverFrequencies.values); // Update state with values only

      // Schedule the next animation frame
      window.requestAnimationFrame(render);
    };

    render();

    return () => {
      isLoaded = false; // Clean up when the component unmounts
    };
  }, []);

  /**
   * Set up render loops for the visualization canvas
   */
  useEffect(() => {
    let isLoaded = true;

    const wavRecorder = wavRecorderRef.current;
    const clientCanvas = clientCanvasRef.current;
    let clientCtx: CanvasRenderingContext2D | null = null;

    const wavStreamPlayer = wavStreamPlayerRef.current;
    const serverCanvas = serverCanvasRef.current;
    let serverCtx: CanvasRenderingContext2D | null = null;

    const render = () => {
      if (isLoaded) {
        if (clientCanvas) {
          if (!clientCanvas.width || !clientCanvas.height) {
            clientCanvas.width = clientCanvas.offsetWidth;
            clientCanvas.height = clientCanvas.offsetHeight;
          }
          clientCtx = clientCtx || clientCanvas.getContext("2d");
          if (clientCtx) {
            clientCtx.clearRect(0, 0, clientCanvas.width, clientCanvas.height);
            const result = wavRecorder.recording
              ? wavRecorder.getFrequencies("voice")
              : { values: new Float32Array([0]) };
            WavRenderer.drawBars(
              clientCanvas,
              clientCtx,
              result.values,
              "#0099ff",
              10,
              0,
              8
            );
          }
        }
        if (serverCanvas) {
          if (!serverCanvas.width || !serverCanvas.height) {
            serverCanvas.width = serverCanvas.offsetWidth;
            serverCanvas.height = serverCanvas.offsetHeight;
          }
          serverCtx = serverCtx || serverCanvas.getContext("2d");
          if (serverCtx) {
            serverCtx.clearRect(0, 0, serverCanvas.width, serverCanvas.height);
            const result = wavStreamPlayer.analyser
              ? wavStreamPlayer.getFrequencies("voice")
              : { values: new Float32Array([0]) };
            WavRenderer.drawBars(
              serverCanvas,
              serverCtx,
              result.values,
              "#009900",
              10,
              0,
              8
            );
          }
        }
        window.requestAnimationFrame(render);
      }
    };
    render();

    return () => {
      isLoaded = false;
    };
  }, []);

  type RatingToBadges = {
    [key: number]: string[]; // Adjust the value type as needed
  };
  const [placeIds, setPlaceIds] = useState([]);
  const [ratingToBadgesData, setRatingsToBadgesData] =
    useState<RatingToBadges>();
  const [reviews, setReviews] = useState<CustomerReviewInfoFromSerializer[]>(
    []
  );
  const findKeywordsInReview = (textBody: string, keywordsArray: string[]) => {
    const foundKeywords: string[] = [];

    keywordsArray.forEach((keyword) => {
      if (textBody.toLowerCase().includes(keyword.toLowerCase())) {
        foundKeywords.push(keyword);
      }
    });

    return foundKeywords;
  };
  function ratingToBadges(reviews: any): Record<number, string[]> {
    return reviews.reduce(
      (acc: any, review: any) => {
        const { rating, badges } = review;

        // If the rating key does not exist, initialize an empty array
        if (!acc[rating]) {
          acc[rating] = [];
        }

        // Concatenate the badges for the current rating
        acc[rating] = acc[rating].concat(badges);

        return acc;
      },
      {} as Record<number, string[]>
    );
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
      } catch (err) {
        console.error(err);
        false;
      }
    };

    fetchData();
  }, []);

  /**
   * Core RealtimeClient and audio capture setup
   * Set all of our instructions, tools, events and more
   */
  useEffect(() => {
    // Get refs
    const wavStreamPlayer = wavStreamPlayerRef.current;
    const client = clientRef.current;
    const localInstructions = `
    System settings:
Tool use: enabled.

You are to help the user create forms. Make use of the tools provided to you whenever you can. You are to only help the user assist in building forms and nothing else.
Reject all other sorts of inquiries that are not related to building the form.
    `;

    // Set instructions
    const formattedQuestions = questions
      .map((q) => `ID: ${q.id}\nContent: ${q.content}`)
      .join("\n\n");
    client.updateSession({
      instructions: formCollectionInstructions + formattedQuestions,
    });
    client.updateSession({ voice: "ash" });
    // Set transcription, otherwise we don't get user transcriptions back
    // client.updateSession({ input_audio_transcription: { model: 'whisper-1' } });

    // Add tools
    client.addTool(
      {
        name: "finalize_conversation",
        description: "Finalizes the conversation and performs cleanup actions.",
        parameters: {
          type: "object",
          properties: {
            reason: {
              type: "string",
              description: "The reason for ending the conversation.",
            },
          },
          required: ["reason"],
        },
      },
      async ({ reason }: { reason: string }) => {
        console.log(`Conversation finalized: ${reason}`);

        // Call the disconnect function to clean up the session
        disconnectConversation();
        handleSubmit(nonUseStateAnswers)
        nonUseStateAnswers.length = 0;

        return {
          success: true,
          message: `Conversation ended successfully: ${reason}`,
        };
      }
    );

    client.addTool(
      {
        name: "update_answer",
        description: "Updates an answer by its question ID.",
        parameters: {
          type: "object",
          properties: {
            questionId: {
              type: "string",
              description:
                "The unique identifier of the question to update the answer for.",
            },
            value: {
              type: "string",
              description: "The updated answer value.",
            },
          },
          required: ["questionId", "value"],
        },
      },
      async ({ questionId, value }: { questionId: string; value: string }) => {
        setAnswers((prev) => ({
          ...prev,
          [questionId]: value,
        }));
        nonUseStateAnswers[questionId] = value;

        return {
          success: true,
          updatedAnswer: { questionId, value },
        };
      }
    );

    client.addTool(
      {
        name: "set_memory",
        description: "Saves important data about the user into memory.",
        parameters: {
          type: "object",
          properties: {
            key: {
              type: "string",
              description:
                "The key of the memory value. Always use lowercase and underscores, no other characters.",
            },
            value: {
              type: "string",
              description: "Value can be anything represented as a string",
            },
          },
          required: ["key", "value"],
        },
      },
      async ({ key, value }: { [key: string]: any }) => {
        setMemoryKv((memoryKv) => {
          const newKv = { ...memoryKv };
          newKv[key] = value;
          return newKv;
        });
        return { ok: true };
      }
    );
    // handle realtime events from client + server for event logging
    client.on("realtime.event", (realtimeEvent: RealtimeEvent) => {
      setRealtimeEvents((realtimeEvents) => {
        const lastEvent = realtimeEvents[realtimeEvents.length - 1];
        if (lastEvent?.event.type === realtimeEvent.event.type) {
          // if we receive multiple events in a row, aggregate them for display purposes
          lastEvent.count = (lastEvent.count || 0) + 1;
          return realtimeEvents.slice(0, -1).concat(lastEvent);
        } else {
          return realtimeEvents.concat(realtimeEvent);
        }
      });
    });
    client.on("error", (event: any) => console.error(event));
    client.on("conversation.interrupted", async () => {
      const trackSampleOffset = await wavStreamPlayer.interrupt();
      if (trackSampleOffset?.trackId) {
        const { trackId, offset } = trackSampleOffset;
        await client.cancelResponse(trackId, offset);
      }
    });
    client.on("conversation.updated", async ({ item, delta }: any) => {
      const items = client.conversation.getItems();
      if (delta?.audio) {
        wavStreamPlayer.add16BitPCM(delta.audio, item.id);
      }
      if (item.status === "completed" && item.formatted.audio?.length) {
        const wavFile = await WavRecorder.decode(
          item.formatted.audio,
          24000,
          24000
        );
        item.formatted.file = wavFile;
      }
      setItems(items);
    });

    setItems(client.conversation.getItems());
    // connectConversation()

    return () => {
      // cleanup; resets to defaults
      client.reset();
    };
  }, []);

  /**
   * Render the application
   */
  return (
    <div className="grid gap-4 h-screen">
      <div className="p-4 overflow-auto">
        <div className="content-top mb-4">
          <div className="content-title flex items-center">
            <Switch
              checked={isVAD}
              onCheckedChange={handleToggle}
              id="vad-mode"
            />
            <Label htmlFor="vad-mode" className="ml-2">
              Continuous
            </Label>
          </div>
          <div className="content-api-key mt-2">
            {!LOCAL_RELAY_SERVER_URL && (
              <Button onClick={() => resetAPIKey()}>Change Key</Button>
            )}
          </div>
        </div>
        <div className="content-main">
          <div className="visualization flex justify-center">
            {/* <div className="visualization-entry">
                    <h2 className="text-center text-white mb-2">Client</h2>
                    <VoiceGridVisualization type="client" frequencyData={clientFrequencies} canvasRef={clientCanvasRef}/>
                  </div> */}
            <div className="visualization-entry">
              <h2 className="text-center text-black mb-2">Server</h2>
              <VoiceGridVisualization
                type="server"
                frequencyData={serverFrequencies}
                canvasRef={serverCanvasRef}
              />
            </div>
          </div>
          <div className="content-actions flex justify-center gap-4">
            {isConnected && canPushToTalk && (
              <Button
                disabled={!isConnected || !canPushToTalk}
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                className="mt-10"
              >
                {isRecording ? "Release to send" : "Push to talk"}
              </Button>
            )}
            <Button
              onClick={
                isConnected ? disconnectConversation : connectConversation
              }
              className="mt-10"
            >
              {isConnected ? "Disconnect" : "Connect"}
            </Button>
          </div>
        </div>
      </div>
      {/* <div className="border p-4 overflow-auto"> */}
      {/* <div className="content-block conversation">
          <div className="content-block-title font-bold mb-2">Conversation</div>
          <div className="content-block-body" data-conversation-content>
            {!items.length && `Awaiting connection...`}
            {items.map((conversationItem) => (
              <div key={conversationItem.id} className="conversation-item mb-4 bg-white p-2 rounded shadow">
                <div className={`speaker ${conversationItem.role || ''} flex justify-between items-center mb-1`}>
                  <div className="font-semibold">
                    {(conversationItem.role || conversationItem.type).replaceAll('_', ' ')}
                  </div>
                  <button
                    className="close text-red-500 hover:text-red-700"
                    onClick={() => deleteConversationItem(conversationItem.id)}
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className={`speaker-content`}>
                  {conversationItem.type === 'function_call_output' && (
                    <div>{conversationItem.formatted.output}</div>
                  )}
                  {!!conversationItem.formatted.tool && (
                    <div>
                      {conversationItem.formatted.tool.name}(
                      {conversationItem.formatted.tool.arguments})
                    </div>
                  )}
                  {!conversationItem.formatted.tool && conversationItem.role === 'user' && (
                    <div>
                      {conversationItem.formatted.transcript ||
                        (conversationItem.formatted.audio?.length
                          ? '(awaiting transcript)'
                          : conversationItem.formatted.text ||
                            '(item sent)')}
                    </div>
                  )}
                  {!conversationItem.formatted.tool && conversationItem.role === 'assistant' && (
                    <div>
                      {conversationItem.formatted.transcript ||
                        conversationItem.formatted.text ||
                        '(truncated)'}
                    </div>
                  )}
                  {conversationItem.formatted.file && (
                    <audio
                      src={conversationItem.formatted.file.url}
                      controls
                      className="mt-2 w-full"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div> */}
      {/* </div> */}
    </div>
  );
}
