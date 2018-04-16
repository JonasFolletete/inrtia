# ☄️ inrtia.js 

lightweight (3kB not gzipped) inertia based animation library

## Demo 
<https://jonasfolletete.github.io/inrtia/>

## Examples
### Basic Usage
```javascript
import Inrtia from 'inrtia';

var inrtia = new Inrtia({
	value : 0,
	interpolation : 'linear'
});

inrtia.to(20);
raf();

function raf() {
	if (!inrtia.stopped) {
		const value = inrtia.update();
		div.style.left = value + 'px' 
		// ... Do stuff with inrtia.value
	}
	window.requestAnimationFrame(raf);
}

```

### Object Usage
```javascript
var inrtia = new Inrtia({
	value : {x: 0, y: 0}
});

inrtia.to({x: 10, y: 20});

```


### Object Usage
```javascript
var inrtia = new Inrtia({
	value : [0, 0, 0]
});

inrtia.to([10, 20, 30]);

```

## References
### Constructor Options
<table>
	<thead>
		<tr>
			<th></th>
			<th scope="col">Type</th>
			<th scope="col">Default</th>
			<th scope="col">Description</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<th scope="row" align="left" nowrap><code>value (required)</code></th>
			<td><code>Number|Object|Array</code></td>
			<td></td>
			<td>Default value</td>
		</tr>
		<tr>
			<th scope="row" align="left" nowrap><code>interpolation</code></th>
			<td nowrap><code>String (linear|bounce|elastic)</code></td>
			<td><code>linear</code></td>
			<td>Method used for interpolation</td>
		</tr>
		<tr>
			<th scope="row" align="left" nowrap><code>friction</code></th>
			<td><code>Number</code></td>
			<td><code>10</code></td>
			<td>The rate at which values slow down after being updated.</td>
		</tr>
		<tr>
			<th scope="row" align="left" nowrap><code>rigidity</code></th>
			<td><code>Number</code></td>
			<td><code>0.1</code></td>
			<td>The rate at which values oscillate after being updated. (not available for <code>linear</code>)</td>
		</tr>
		<tr>
			<th scope="row" align="left" nowrap><code>precisionStop</code></th>
			<td><code>Number</code></td>
			<td><code>0.001</code></td>
			<td>Minimum delta <code>(value - targetValue)</code> to consider animation complete.</td>
		</tr>
		<tr>
			<th scope="row" align="left" nowrap><code>perfectStop</code></th>
			<td><code>Boolean</code></td>
			<td><code>false</code></td>
			<td>Define if <code>value</code> jumps to <code>targetValue</code> at the end of the animation</td>
		</tr>
	</tbody>
</table>


### Methods ###
<table>
	<thead>
		<tr>
			<th></th>
			<th scope="col">Description</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<th scope="row" align="left" nowrap><code>.to(targetValue : &lt;number|object|array&gt;)</code></th>
			<td>Update targetValue value and restart inrtia (if stopped)</td>
		</tr>
		<tr>
			<th scope="row" align="left" nowrap><code>.update(deltaTime : &lt;number&gt; = false)</code></th>
			<td>Method to update inrtia (to use in <code>requestAnimationFrame</code>). <br/>
			If deltaTime (milliseconds) is not specified then it's automatically detected.<br/>
			The method also return the current value.
			</td>
		</tr>
		<tr>
			<th scope="row" align="left" nowrap><code>.stop()</code></th>
			<td>Stop inrtia</td>
		</tr>
	</tbody>
</table>

### Properties
<table>
	<thead>
		<tr>
			<th></th>
			<th scope="col">Type</th>
			<th scope="col">Description</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<th scope="row" align="left" nowrap><code>.value</code></th>
			<td><code>Number|Object|Array</code></td>
			<td>Current value</td>
		</tr>
		<tr>
			<th scope="row" align="left" nowrap><code>.targetValue</code></th>
			<td><code>Number|Object|Array</code></td>
			<td>Target value</td>
		</tr>
		<tr>
			<th scope="row" align="left" nowrap><code>.stopped</code></th>
			<td><code>Boolean</code></td>
			<td>Define if inrtia is stopped </td>
		</tr>
	</tbody>
</table>

