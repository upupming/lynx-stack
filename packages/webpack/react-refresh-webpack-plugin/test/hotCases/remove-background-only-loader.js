export default function(source) {
  return source.replace(/import\s+['"]background-only['"];\n?/g, '');
};
