// The "Connection details" window — where the URLs live forever after setup.
// Opened from the app menu or tray. Also lets the user connect a new tool
// later without re-running setup.
import { invoke } from "@tauri-apps/api/core";
import {
  ConnectionDetails,
  ToolStatus,
  copyBothButton,
  detailCards,
  emailButton,
  h,
} from "./shared";
import { toolRows } from "./shared";
import "./style.css";

const app = document.querySelector<HTMLDivElement>("#app")!;

async function boot() {
  let details: ConnectionDetails;
  try {
    details = await invoke<ConnectionDetails>("get_connection_details");
  } catch {
    app.replaceChildren(
      h("div", { class: "screen" }, [
        h("h1", {}, ["Not set up yet"]),
        h("p", { class: "lede" }, [
          "Finish setting up your Second Brain first — these details appear here afterwards.",
        ]),
      ]),
    );
    return;
  }
  const tools = await invoke<ToolStatus>("detect_tools");

  app.replaceChildren(
    h("div", { class: "screen" }, [
      h("h1", {}, ["Connection details"]),
      h("p", { class: "lede" }, ["Everything you need to connect a tool or another computer."]),
      ...detailCards(details),
      h("div", { class: "actions-spread" }, [copyBothButton(details), emailButton(details)]),
      h("div", { style: "height:18px" }),
      h("div", { class: "url-label" }, ["Connect a new tool"]),
      h("div", { class: "url-desc" }, [
        "Tools on this computer connect with one click. For anything else, " +
          "paste your connection link into the tool's connector settings — " +
          "it will ask for your password the first time.",
      ]),
      toolRows(details, tools),
    ]),
  );
}

void boot();
