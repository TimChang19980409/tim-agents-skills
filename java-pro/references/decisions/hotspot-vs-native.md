# HotSpot Vs Native

## Decision

Choose whether a Java workload should stay on HotSpot or move to native image.

## Signals/constraints

- Startup budget
- Reflection or dynamic proxy usage
- Build and ops complexity

## Options

- Stay on HotSpot
- Use native image
- Try CDS/AppCDS first

## Recommendation rule

Recommend native image only when startup gains clearly outweigh compatibility and build costs.

## Tradeoffs

- Native image helps startup but raises build and compatibility complexity.
- HotSpot keeps profiling and ecosystem support simpler.

## Verification

- If the prompt asks for `Selected:`, start with `Selected: hotspot-vs-native`
- State the chosen runtime and the measurement gate before rollout.
