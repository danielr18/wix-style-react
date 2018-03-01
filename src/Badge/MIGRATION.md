# Migration to the new Badge component

## Seperation into 2 components
The Badge component have 2 shapes: `ellipse` and `rectangle`.
Instead, we are going to have 2 components:

1. Badge - Replaces the Rectangle shaped badge.

2. CounterBadge - Replaces the ellipse shaped badge (and should only look like a small pinple).


## Deprecated props
`alignment` - Deprecated because this is purly a general layout configuration which defines how this component will be displayed with respect to it's environment. Such configuration is not in the component's responsibility.

`appearance` - Deprecated because according to the new design the only allowed appearance is `T5`.

`shape` - Deprecated because of the seperation into 2 components `Badge` & `CounterBadge`.

## New props
`type` - This prop used to set the color of the Badge, but in the new version this prop will have a different role. It's optional values are:
`solid`is the default look, `outlined` is with transparen background and `transparent` is borderLess. Feel free to check the updated storybook.

`skin` - This is the prop which controlls the color of the Badge. It has some new values which you should check out in the storybook, but these are the main important changes:

- `default` ---> `grey`

- `primary` -> changing a little bit and being renamed to `standard`

- `success` --> remains the same

- `info` --> changing a little bit and being renamed to `neutralStandard`

- `warning` ---> remains the same

- `danger` ---> remains the same

- `businessManagerCounter` ---> is only in use in CounterBadge

`prefixIcon` - Add an icon before the text.

`suffixIcon` - Add an icon after the text.

## Testkit Deprecations (e2e & unit)

`isBadge`, `isOfAppearance`, `isOfAlignment` and `isOfShape` are deprecated due to the reasons mentioned before.

Instead of `isBadge` use `exists`.

## TPA Badge
This component is deprecated as well. If you are using it for some reason, please let us know because we have an alternative supported solution.