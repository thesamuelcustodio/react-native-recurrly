const assert = require("node:assert/strict");
const fs = require("node:fs");
const Module = require("node:module");
const path = require("node:path");
const { after, describe, it } = require("node:test");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const ts = require("typescript");

const repositoryRoot = path.resolve(
  path.dirname(require.resolve("./SubscriptionCard.tsx")),
  "..",
);
const originalLoad = Module._load;
const originalTsLoader = Module._extensions[".ts"];
const originalTsxLoader = Module._extensions[".tsx"];

function nativeElement(tag, { isImage = false } = {}) {
  return function NativeElement({
    children,
    ellipsizeMode: _ellipsizeMode,
    numberOfLines: _numberOfLines,
    onPress,
    source: _source,
    ...props
  }) {
    if (isImage) {
      return React.createElement(tag, { ...props, alt: "" });
    }

    return React.createElement(
      tag,
      onPress ? { ...props, onClick: onPress } : props,
      children,
    );
  };
}

const reactNativeMock = {
  Image: nativeElement("img", { isImage: true }),
  Pressable: nativeElement("button"),
  Text: nativeElement("span"),
  TouchableOpacity: nativeElement("button"),
  View: nativeElement("div"),
};

function transpileTypeScript(module, filename) {
  const source = fs.readFileSync(filename, "utf8");
  const result = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: filename,
  });

  module._compile(result.outputText, filename);
}

Module._extensions[".ts"] = transpileTypeScript;
Module._extensions[".tsx"] = transpileTypeScript;
Module._load = function loadWithTestAliases(request, parent, isMain) {
  if (request === "react-native") return reactNativeMock;
  if (request.startsWith("@/")) {
    request = path.join(repositoryRoot, request.slice(2));
  }
  return originalLoad.call(this, request, parent, isMain);
};

after(() => {
  Module._load = originalLoad;
  if (originalTsLoader) Module._extensions[".ts"] = originalTsLoader;
  else delete Module._extensions[".ts"];
  if (originalTsxLoader) Module._extensions[".tsx"] = originalTsxLoader;
  else delete Module._extensions[".tsx"];
});

const ListHeading = require("./ListHeading.tsx").default;
const SubscriptionCard = require("./SubscriptionCard.tsx").default;
const UpcomingSubscriptionCard = require("./UpcomingSubscriptionCard.tsx").default;

const baseSubscription = {
  billing: "Monthly",
  category: "Music",
  color: "#123456",
  currency: "USD",
  expanded: false,
  icon: 1,
  name: "Spotify",
  onPress() {},
  paymentMethod: "Visa ending in 1234",
  plan: "Premium",
  price: 5.99,
  renewalDate: "2026-03-20",
  startDate: "2025-03-20",
  status: "active",
};

describe("SubscriptionCard", () => {
  it("renders the collapsed summary and applies its configured card color", () => {
    const markup = renderToStaticMarkup(
      React.createElement(SubscriptionCard, baseSubscription),
    );

    assert.match(markup, /Spotify/);
    assert.match(markup, /Music/);
    assert.match(markup, /\$5\.99/);
    assert.match(markup, /Monthly/);
    assert.match(markup, /sub-card bg-card/);
    assert.match(markup, /background-color:#123456/);
    assert.doesNotMatch(markup, /Payment:/);
  });

  it("passes presses through to the supplied handler", () => {
    const onPress = () => {};
    const card = SubscriptionCard({ ...baseSubscription, onPress });

    assert.equal(card.props.onPress, onPress);
  });

  it("falls back from a blank category to the trimmed plan", () => {
    const markup = renderToStaticMarkup(
      React.createElement(SubscriptionCard, {
        ...baseSubscription,
        category: "   ",
        plan: "  Premium Plus  ",
      }),
    );

    assert.match(markup, /Premium Plus/);
  });

  it("uses the renewal date when category and plan are unavailable", () => {
    const markup = renderToStaticMarkup(
      React.createElement(SubscriptionCard, {
        ...baseSubscription,
        category: undefined,
        plan: undefined,
      }),
    );

    assert.match(markup, /03\/20\/2026/);
  });

  it("renders trimmed and formatted details only when expanded", () => {
    const markup = renderToStaticMarkup(
      React.createElement(SubscriptionCard, {
        ...baseSubscription,
        category: "  Music  ",
        expanded: true,
        paymentMethod: "  Visa ending in 1234  ",
      }),
    );

    assert.match(markup, /sub-card sub-card-expanded/);
    assert.doesNotMatch(markup, /background-color:#123456/);
    assert.match(markup, /Payment:<\/span><span[^>]*>Visa ending in 1234/);
    assert.match(markup, /Category:<\/span><span[^>]*>Music/);
    assert.match(markup, /Started:<\/span><span[^>]*>03\/20\/2025/);
    assert.match(markup, /Renewal date:<\/span><span[^>]*>03\/20\/2026/);
    assert.match(markup, /Status:<\/span><span[^>]*>Active/);
  });

  it("keeps missing optional expanded details empty", () => {
    const markup = renderToStaticMarkup(
      React.createElement(SubscriptionCard, {
        ...baseSubscription,
        category: undefined,
        expanded: true,
        paymentMethod: undefined,
        plan: undefined,
        renewalDate: undefined,
        startDate: undefined,
        status: undefined,
      }),
    );

    assert.match(markup, /Payment:/);
    assert.match(markup, /Renewal date:/);
    assert.doesNotMatch(markup, /Not provided|Unknown/);
  });
});

describe("UpcomingSubscriptionCard", () => {
  function renderUpcoming(daysLeft, overrides = {}) {
    return renderToStaticMarkup(
      React.createElement(UpcomingSubscriptionCard, {
        currency: "USD",
        daysLeft,
        icon: 1,
        name: "Notion",
        price: 12,
        ...overrides,
      }),
    );
  }

  it("shows the remaining day count for renewals more than one day away", () => {
    const markup = renderUpcoming(2);

    assert.match(markup, /\$12\.00/);
    assert.match(markup, /2 days left/);
    assert.match(markup, /Notion/);
  });

  it("uses the last-day label at and below the one-day boundary", () => {
    assert.match(renderUpcoming(1), /Last day/);
    assert.match(renderUpcoming(0), /Last day/);
  });

  it("formats prices in the subscription currency", () => {
    assert.match(renderUpcoming(3, { currency: "EUR", price: 15 }), /€15\.00/);
  });
});

describe("ListHeading", () => {
  it("renders its title and list action", () => {
    const markup = renderToStaticMarkup(
      React.createElement(ListHeading, { title: "Upcoming" }),
    );

    assert.match(markup, /Upcoming/);
    assert.match(markup, /View all/);
  });
});
