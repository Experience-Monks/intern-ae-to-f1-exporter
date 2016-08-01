Dim appRef
Dim argsArr()

Set appRef = CreateObject("Illustrator.Application")

ReDim argsArr(Wscript.Arguments.length-1)

For i = 0 To Wscript.Arguments.length-2
    argsArr(i) = Wscript.Arguments(i)
Next

Dim out : out = appRef.DoJavaScriptFile(Wscript.Arguments(2), argsArr, 1)