export default function transformer(file, api) {
    const j = api.jscodeshift;

    // Parse the source code
    const root = j(file.source);

    // Transform all `Card` imports to `CustomCard`
    root.find(j.ImportDeclaration)
        .filter((path) => path.node.source.value === 'antd')
        .forEach((path) => {
            const cardSpecifier = path.node.specifiers.find(
                (spec) => spec.imported.name === 'Card'
            );
            if (cardSpecifier) {
                // Rename 'Card' to 'CustomCard'
                cardSpecifier.imported.name = 'CustomCard';
                path.node.source.value = '../shared/CustomCard'; // Update the import path
            }
        });

    // Replace `bodyStyle` prop in `<Card>` components
    root.find(j.JSXOpeningElement, { name: { name: 'Card' } })
        .forEach((path) => {
            const attributes = path.node.attributes;

            // Find and remove the `bodyStyle` prop
            const bodyStyleIndex = attributes.findIndex(
                (attr) => attr.name && attr.name.name === 'bodyStyle'
            );

            if (bodyStyleIndex !== -1) {
                const bodyStyleValue = attributes[bodyStyleIndex].value;

                // Replace with a `bodyClassName` prop if necessary
                if (bodyStyleValue && bodyStyleValue.expression) {
                    attributes[bodyStyleIndex] = j.jsxAttribute(
                        j.jsxIdentifier('bodyClassName'),
                        j.stringLiteral('customBodyStyle') // Use a consistent CSS class
                    );
                } else {
                    attributes.splice(bodyStyleIndex, 1); // Remove the attribute
                }
            }

            // Update the component name from `Card` to `CustomCard`
            path.node.name.name = 'CustomCard';
        });

    return root.toSource();
}
